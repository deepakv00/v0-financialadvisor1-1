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
  model?: "bulbul:v1"
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
      const response = await fetch(`${this.baseUrl}/text-to-speech`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "API-Subscription-Key": this.apiKey,
        },
        body: JSON.stringify({
          inputs: params.inputs,
          target_language_code: params.target_language_code,
          speaker: params.speaker,
          pitch: params.pitch || 0,
          pace: params.pace || 1.0,
          loudness: params.loudness || 1.0,
          speech_sample_rate: params.speech_sample_rate || 8000,
          enable_preprocessing: params.enable_preprocessing ?? true,
          model: params.model || "bulbul:v1",
        }),
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

// Singleton instance
let sarvamClient: SarvamClient | null = null

export function getSarvamClient(): SarvamClient {
  if (!sarvamClient) {
    sarvamClient = new SarvamClient()
  }
  return sarvamClient
}

export { SarvamClient }
export type { SarvamTranslateRequest, SarvamTranslateResponse, SarvamTTSRequest, SarvamTTSResponse }
