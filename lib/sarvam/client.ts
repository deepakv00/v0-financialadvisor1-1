interface SarvamTranslateRequest {
  input: string
  source_language_code: string
  target_language_code: string
  speaker_gender?: "Male" | "Female"
  mode?: "formal" | "modern-colloquial" | "classic-colloquial" | "code-mixed"
  model?: "mayura:v1" | "mayura:v2"
  enable_preprocessing?: boolean
}

interface SarvamTranslateResponse {
  translated_text: string
}

interface SarvamTTSRequest {
  inputs: string[]
  target_language_code: string
  speaker: string
  pitch?: number
  pace?: number
  loudness?: number
  speech_sample_rate?: number
  enable_preprocessing?: boolean
  model?: "bulbul:v2" | "bulbul:v3-beta"
}

interface SarvamTTSResponse {
  audios: string[] // Base64 encoded audio
}

class SarvamClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.SARVAM_API_KEY || "sk_d4maw0nu_0yxtfVnj0chEjNd4dCo3HzNx"
    this.baseUrl = "https://api.sarvam.ai"
  }

  async translate(params: SarvamTranslateRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Subscription-Key": this.apiKey,
        },
        body: JSON.stringify({
          input: params.input,
          source_language_code: params.source_language_code,
          target_language_code: params.target_language_code,
          speaker_gender: params.speaker_gender || "Male",
          mode: params.mode || "formal",
          model: params.model || "mayura:v1",
          enable_preprocessing: params.enable_preprocessing ?? true,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Sarvam API error: ${response.status} - ${errorText}`)
      }

      const data: SarvamTranslateResponse = await response.json()
      return data.translated_text
    } catch (error) {
      console.error("Sarvam translation error:", error)
      throw error
    }
  }

  async textToSpeech(params: SarvamTTSRequest): Promise<string[]> {
    try {
      const maxLen = 500
      const safeChunks: string[] = []
      const chunkOne = (text: string) => {
        if (text.length <= maxLen) {
          safeChunks.push(text)
          return
        }
        let start = 0
        while (start < text.length) {
          const slice = text.slice(start, Math.min(start + maxLen, text.length))
          if (slice.length < maxLen) {
            safeChunks.push(slice)
            break
          }
          const punctIdx = Math.max(slice.lastIndexOf("."), slice.lastIndexOf("!"), slice.lastIndexOf("?"))
          const cut = punctIdx > 50 ? start + punctIdx + 1 : start + maxLen
          safeChunks.push(text.slice(start, cut))
          start = cut
        }
      }

      for (const str of params.inputs) {
        chunkOne(str)
      }

      const speaker = params.speaker && params.speaker.trim().length > 0 ? params.speaker : "anushka"
      const model: "bulbul:v2" | "bulbul:v3-beta" = params.model || "bulbul:v2"

      const body: Record<string, any> = {
        inputs: safeChunks,
        target_language_code: params.target_language_code,
        speaker,
        model,
        ...(typeof params.enable_preprocessing === "boolean"
          ? { enable_preprocessing: params.enable_preprocessing }
          : {}),
      }

      if (typeof params.pitch === "number") body.pitch = params.pitch
      if (typeof params.pace === "number") body.pace = params.pace
      if (typeof params.loudness === "number") body.loudness = params.loudness
      if (typeof params.speech_sample_rate === "number") body.speech_sample_rate = params.speech_sample_rate

      const response = await fetch(`${this.baseUrl}/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Subscription-Key": this.apiKey,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Sarvam TTS API error: ${response.status} - ${errorText}`)
      }

      const data: SarvamTTSResponse = await response.json()
      return data.audios
    } catch (error) {
      console.error("Sarvam TTS error:", error)
      throw error
    }
  }
}

let sarvamClient: SarvamClient | null = null

export function getSarvamClient(): SarvamClient {
  if (!sarvamClient) {
    sarvamClient = new SarvamClient()
  }
  return sarvamClient
}

export { SarvamClient }
export type { SarvamTranslateRequest, SarvamTranslateResponse, SarvamTTSRequest, SarvamTTSResponse }
