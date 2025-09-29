import { generateText } from "ai"
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

    const result = await generateText({
      model: "google/gemini-1.5-flash-latest",
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
      maxTokens: 1024,
    })

    let responseText = result.text

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
    return new Response("Internal server error", { status: 500 })
  }
}
