import type { NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getSarvamClient } from "@/lib/sarvam/client"
import { getSarvamLanguageCode } from "@/lib/sarvam/utils"

export const maxDuration = 30

async function getUserProfile(userId: string) {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userId).single()
    return profile
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

async function saveToHistory(userId: string, message: string, response: string, context: string) {
  try {
    const supabase = await createClient()
    await supabase.from("chat_history").insert({
      user_id: userId,
      message,
      response,
      context,
    })
  } catch (error) {
    console.error("Error saving chat history:", error)
  }
}

function buildSystemPrompt(context: string, userProfile: any, language = "en-IN") {
  let systemPrompt = `You are a professional AI Financial Advisor. You provide helpful, accurate, and personalized financial guidance.

IMPORTANT GUIDELINES:
- Always provide educational, informative responses
- Never give specific investment recommendations for individual stocks
- Always suggest consulting with qualified financial professionals for major decisions
- Use Indian financial context (INR, Indian financial products, regulations)
- Be conversational but professional
- Keep responses concise but comprehensive`

  if (language !== "en-IN") {
    systemPrompt += `
- The user is communicating in ${language}
- You should respond in the same language as the user's query
- If the user writes in English, respond in English
- If the user writes in an Indian language, respond in that language
- Maintain financial terminology accuracy across languages`
  }

  systemPrompt += `

CONTEXT: You are currently in the ${context} advisory portal.`

  // Add user profile context if available
  if (userProfile) {
    systemPrompt += `

USER PROFILE:
- Age: ${userProfile.age || "Not specified"}
- Monthly Income: ₹${userProfile.monthly_income || "Not specified"}
- Monthly Expenses: ₹${userProfile.monthly_expenses || "Not specified"}
- Current Savings: ₹${userProfile.current_savings || "Not specified"}
- Dependents: ${userProfile.dependents || 0}
- Risk Tolerance: ${userProfile.risk_tolerance || "Not specified"}
- Investment Experience: ${userProfile.investment_experience || "Not specified"}

Please personalize your advice based on this profile when relevant.`
  }

  // Add context-specific guidance
  const contextGuidance = {
    financial:
      "Focus on budgeting, savings strategies, emergency funds, retirement planning, and general financial wellness.",
    loan: "Focus on loan eligibility, EMI calculations, debt management, credit scores, and loan comparisons.",
    investment:
      "Focus on investment strategies, portfolio allocation, SIP planning, mutual funds, and risk management.",
    insurance: "Focus on insurance needs assessment, coverage calculations, policy comparisons, and claim guidance.",
    general: "Provide comprehensive financial guidance across all areas.",
  }

  systemPrompt += `\n\nSPECIALIZATION: ${contextGuidance[context as keyof typeof contextGuidance] || contextGuidance.general}`

  return systemPrompt
}

async function translateResponse(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === "en-IN") {
    return text
  }

  try {
    const sarvamClient = getSarvamClient()
    const sourceCode = getSarvamLanguageCode("en-IN")
    const targetCode = getSarvamLanguageCode(targetLanguage)

    const translated = await sarvamClient.translate({
      input: text,
      source_language_code: sourceCode,
      target_language_code: targetCode,
      mode: "formal",
    })

    return translated
  } catch (error) {
    console.error("Translation error in chat:", error)
    return text // Return original text on error
  }
}

// Helper to list models on both API versions and pick the best available
async function listGeminiModelsAll(apiKey: string) {
  const versions = ["v1", "v1beta"] as const
  const results: Array<{ version: "v1" | "v1beta"; models: any[] }> = []

  for (const ver of versions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${apiKey}`)
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        console.log("[v0] ListModels failed", { version: ver, status: res.status, body })
        continue
      }
      const json = (await res.json()) as { models?: any[] }
      const models = Array.isArray(json?.models) ? json!.models! : []
      console.log("[v0] ListModels success", { version: ver, count: models.length })
      results.push({ version: ver, models })
    } catch (err: any) {
      console.log("[v0] ListModels error", { version: ver, err: String(err) })
    }
  }

  return results
}

function normalizeModelName(name: string) {
  // API may return "models/gemini-1.5-pro-002" — we need just "gemini-1.5-pro-002"
  return name.includes("/") ? name.split("/").pop()! : name
}

function supportsGenerateContent(m: any) {
  const methods = Array.isArray(m?.supportedGenerationMethods) ? m.supportedGenerationMethods : []
  // Some responses omit supportedGenerationMethods; assume generateContent is okay then.
  return methods.length === 0 || methods.includes("generateContent")
}

function isLLM(m: any) {
  const n = (m?.name ?? "") as string
  // Exclude embedding-only models etc.
  return n.includes("gemini") && !n.includes("embedding")
}

async function callGeminiAPI(messages: any[], systemPrompt: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
  if (!GEMINI_API_KEY) {
    throw new Error("Google Gemini API key not found. Please add GEMINI_API_KEY or GOOGLE_API_KEY in Vars.")
  }

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    ...messages.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),
  ]

  const generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 768,
  }

  // 1) Discover models across v1 + v1beta
  const discovered = await listGeminiModelsAll(GEMINI_API_KEY)

  // Create ordered candidates from discovered models (prefer v1, then v1beta)
  const discoveredCandidates: Array<{ version: "v1" | "v1beta"; model: string }> = []
  for (const { version, models } of discovered.sort((a, b) => (a.version === "v1" ? -1 : 1))) {
    for (const m of models) {
      if (!isLLM(m) || !supportsGenerateContent(m)) continue
      discoveredCandidates.push({ version, model: normalizeModelName(m.name as string) })
    }
  }

  // 2) Fallback matrix when discovery is empty or insufficient
  // These include explicit numeric variants to avoid “alias not found” errors.
  const fallbackMatrix: Array<{ version: "v1" | "v1beta"; model: string }> = [
    // v1 candidates
    { version: "v1", model: "gemini-1.5-pro-002" },
    { version: "v1", model: "gemini-1.5-flash-002" },
    { version: "v1", model: "gemini-1.5-pro-001" },
    { version: "v1", model: "gemini-1.5-flash-001" },
    { version: "v1", model: "gemini-1.5-pro" },
    { version: "v1", model: "gemini-1.5-flash" },

    // v1beta candidates
    { version: "v1beta", model: "gemini-1.5-pro-002" },
    { version: "v1beta", model: "gemini-1.5-flash-002" },
    { version: "v1beta", model: "gemini-1.5-pro-001" },
    { version: "v1beta", model: "gemini-1.5-flash-001" },
    { version: "v1beta", model: "gemini-1.0-pro" },
    { version: "v1beta", model: "gemini-pro" },
  ]

  const tried: Array<{ version: string; model: string; status?: number; note?: string }> = []
  let lastErr: any = null

  // 3) Try discovered first, then fallbacks
  const toTry = [...discoveredCandidates, ...fallbackMatrix]

  for (const { version, model } of toTry) {
    const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${GEMINI_API_KEY}`
    try {
      console.log("[v0] Trying Gemini", { version, model })
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents, generationConfig }),
      })

      if (!response.ok) {
        const body = await response.text().catch(() => "")
        tried.push({ version, model, status: response.status, note: body.slice(0, 200) })
        // If model not found/unsupported, keep trying next
        if (response.status === 404 || response.status === 400 || response.status === 403) {
          lastErr = new Error(`[${version}] ${model} -> ${response.status}: ${body}`)
          continue
        }
        lastErr = new Error(`[${version}] ${model} -> ${response.status}: ${body}`)
        continue
      }

      const data = await response.json()
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        data?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p?.text)
          .filter(Boolean)
          .join(" ")

      if (typeof text === "string" && text.trim().length > 0) {
        console.log("[v0] Gemini success", { version, model })
        return text
      }

      tried.push({ version, model, note: "Empty response" })
      lastErr = new Error(`[${version}] ${model} -> Empty response`)
    } catch (err: any) {
      tried.push({ version, model, note: `Exception: ${String(err)}` })
      lastErr = err
      continue
    }
  }

  console.log("[v0] Gemini tried matrix", tried)
  throw new Error(
    `Gemini request failed across versions/models. Last error: ${
      lastErr instanceof Error ? lastErr.message : String(lastErr)
    }`,
  )
}

export async function POST(request: NextRequest) {
  try {
    const { messages, language = "en-IN", context = "general" } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response("Messages array is required", { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    let userProfile = null
    if (user) {
      userProfile = await getUserProfile(user.id)
    }

    const systemPrompt = buildSystemPrompt(context, userProfile, language)

    let responseText = await callGeminiAPI(messages, systemPrompt)

    // Translate response if needed
    if (language !== "en-IN") {
      responseText = await translateResponse(responseText, language)
    }

    // Save to history
    if (user && messages.length > 0) {
      const lastUserMessage = messages[messages.length - 1]
      if (lastUserMessage.role === "user") {
        await saveToHistory(user.id, lastUserMessage.content, responseText, context)
      }
    }

    // Create a streaming response manually
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        // Send the response in chunks to simulate streaming
        const words = responseText.split(" ")
        let index = 0

        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words[index] + (index < words.length - 1 ? " " : "")
            const data = JSON.stringify({ type: "text-delta", textDelta: chunk })
            controller.enqueue(encoder.encode(`0:${data}\n`))
            index++
            setTimeout(sendChunk, 50) // Delay between words for streaming effect
          } else {
            controller.close()
          }
        }

        sendChunk()
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response(
      JSON.stringify({
        error: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
