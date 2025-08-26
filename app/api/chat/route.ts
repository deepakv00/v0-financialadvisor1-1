import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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

function buildContextualPrompt(message: string, context: string, userProfile: any, history: any[]) {
  let systemPrompt = `You are a professional AI Financial Advisor powered by Google Gemini. You provide helpful, accurate, and personalized financial guidance.

IMPORTANT GUIDELINES:
- Always provide educational, informative responses
- Never give specific investment recommendations for individual stocks
- Always suggest consulting with qualified financial professionals for major decisions
- Use Indian financial context (INR, Indian financial products, regulations)
- Be conversational but professional
- Keep responses concise but comprehensive

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

  // Add conversation history context
  if (history && history.length > 0) {
    systemPrompt += `\n\nRECENT CONVERSATION CONTEXT:\n`
    history.slice(-3).forEach((msg: any, index: number) => {
      systemPrompt += `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}\n`
    })
  }

  systemPrompt += `\n\nUser's current question: ${message}`

  return systemPrompt
}

async function callDeepSeekAPI(prompt: string) {
  try {
    const DEEPSEEK_API_KEY =
      process.env.DEEPSEEK_API_KEY || "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"
    const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-reasoner",
        messages: [
          {
            role: "system",
            content: "You are a professional financial advisor. Provide helpful, accurate financial guidance.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      if (response.status === 401) {
        return null // Invalid API key, fall back to Gemini only
      }
      throw new Error(`DeepSeek API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || "No response from DeepSeek"
  } catch (error) {
    return null
  }
}

async function callGeminiAPI(prompt: string) {
  try {
    const GEMINI_API_KEY = "AIzaSyAQQR9QuaypbfPmhwFM5NNGMMd_BDcnKxQ"
    const GEMINI_API_URL =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini"
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return "Gemini API unavailable"
  }
}

function combineResponses(geminiResponse: string, deepseekResponse: string | null) {
  if (geminiResponse === "Gemini API unavailable" && !deepseekResponse) {
    return "I apologize, but AI services are currently unavailable. Please try again later."
  }

  if (geminiResponse === "Gemini API unavailable") {
    return `**DeepSeek R1 Analysis:**\n\n${deepseekResponse}`
  }

  if (!deepseekResponse) {
    return `**Google Gemini Analysis:**\n\n${geminiResponse}`
  }

  return `**Combined AI Analysis:**\n\n**Google Gemini Perspective:**\n${geminiResponse}\n\n**DeepSeek R1 Perspective:**\n${deepseekResponse}\n\n*This response combines insights from both Google Gemini and DeepSeek R1 for comprehensive financial guidance.*`
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Chat API called")

    const { message, context, history } = await request.json()
    console.log("[v0] Received message:", message, "context:", context)

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log("[v0] User authenticated:", !!user)

    let userProfile = null
    if (user) {
      userProfile = await getUserProfile(user.id)
      console.log("[v0] User profile loaded:", !!userProfile)
    }

    const prompt = buildContextualPrompt(message, context || "general", userProfile, history)
    console.log("[v0] Calling both AI APIs...")

    const [geminiResponse, deepseekResponse] = await Promise.all([callGeminiAPI(prompt), callDeepSeekAPI(prompt)])

    console.log("[v0] Both AI responses received")

    const combinedResponse = combineResponses(geminiResponse, deepseekResponse)

    if (user) {
      await saveToHistory(user.id, message, combinedResponse, context || "general")
    }

    return NextResponse.json({
      response: combinedResponse,
      context: context || "general",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)

    const fallbackResponse =
      "I apologize, but I'm experiencing technical difficulties. Please try again in a moment, or consider consulting with a qualified financial advisor for immediate assistance."

    return NextResponse.json({
      response: fallbackResponse,
      context: "general",
      timestamp: new Date().toISOString(),
    })
  }
}
