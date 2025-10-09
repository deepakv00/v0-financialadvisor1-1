// Language mappings and utilities for Sarvam API
export const SARVAM_LANGUAGES = {
  "en-IN": { name: "English", nativeName: "English", sarvamCode: "en-IN" },
  "hi-IN": { name: "Hindi", nativeName: "हिन्दी", sarvamCode: "hi-IN" },
  "bn-IN": { name: "Bengali", nativeName: "বাংলা", sarvamCode: "bn-IN" },
  "gu-IN": { name: "Gujarati", nativeName: "ગુજરાતી", sarvamCode: "gu-IN" },
  "kn-IN": { name: "Kannada", nativeName: "ಕನ್ನಡ", sarvamCode: "kn-IN" },
  "ml-IN": { name: "Malayalam", nativeName: "മലയാളം", sarvamCode: "ml-IN" },
  "mr-IN": { name: "Marathi", nativeName: "मराठी", sarvamCode: "mr-IN" },
  "od-IN": { name: "Odia", nativeName: "ଓଡ଼ିଆ", sarvamCode: "od-IN" },
  "pa-IN": { name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", sarvamCode: "pa-IN" },
  "ta-IN": { name: "Tamil", nativeName: "தமிழ்", sarvamCode: "ta-IN" },
  "te-IN": { name: "Telugu", nativeName: "తెలుగు", sarvamCode: "te-IN" },
} as const

export type SupportedLanguage = keyof typeof SARVAM_LANGUAGES

// TTS Speaker mappings
export const TTS_SPEAKERS = {
  "en-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "hi-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "bn-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "gu-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "kn-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "ml-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "mr-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "od-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "pa-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "ta-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
  "te-IN": [
    "anushka",
    "abhilash",
    "manisha",
    "vidya",
    "arya",
    "karun",
    "hitesh",
    "aditya",
    "isha",
    "ritu",
    "chirag",
    "harsh",
    "sakshi",
    "priya",
    "neha",
    "rahul",
    "pooja",
    "rohan",
    "simran",
    "kavya",
    "anjali",
    "sneha",
    "kiran",
    "vikram",
    "rajesh",
    "sunita",
    "tara",
    "anirudh",
    "kriti",
    "ishaan",
  ],
} as const

export function getSarvamLanguageCode(languageCode: string): string {
  return SARVAM_LANGUAGES[languageCode as SupportedLanguage]?.sarvamCode || "en-IN"
}

export function isLanguageSupported(languageCode: string): boolean {
  return languageCode in SARVAM_LANGUAGES
}

export function getAvailableSpeakers(languageCode: string): string[] {
  return TTS_SPEAKERS[languageCode as SupportedLanguage] || ["anushka", "abhilash", "manisha"]
}

export function detectLanguage(text: string): string {
  // Simple language detection based on script
  const hindiRegex = /[\u0900-\u097F]/
  const bengaliRegex = /[\u0980-\u09FF]/
  const gujaratiRegex = /[\u0A80-\u0AFF]/
  const kannadaRegex = /[\u0C80-\u0CFF]/
  const malayalamRegex = /[\u0D00-\u0D7F]/
  const marathiRegex = /[\u0900-\u097F]/
  const odiaRegex = /[\u0B00-\u0B7F]/
  const punjabiRegex = /[\u0A00-\u0A7F]/
  const tamilRegex = /[\u0B80-\u0BFF]/
  const teluguRegex = /[\u0C00-\u0C7F]/

  if (hindiRegex.test(text)) return "hi-IN"
  if (bengaliRegex.test(text)) return "bn-IN"
  if (gujaratiRegex.test(text)) return "gu-IN"
  if (kannadaRegex.test(text)) return "kn-IN"
  if (malayalamRegex.test(text)) return "ml-IN"
  if (marathiRegex.test(text)) return "mr-IN"
  if (odiaRegex.test(text)) return "od-IN"
  if (punjabiRegex.test(text)) return "pa-IN"
  if (tamilRegex.test(text)) return "ta-IN"
  if (teluguRegex.test(text)) return "te-IN"

  return "en-IN" // Default to English
}

export function chunkText(text: string, maxLength = 1000): string[] {
  if (text.length <= maxLength) {
    return [text]
  }

  const chunks: string[] = []
  const sentences = text.split(/[.!?]+/)
  let currentChunk = ""

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (!trimmedSentence) continue

    if (currentChunk.length + trimmedSentence.length + 1 <= maxLength) {
      currentChunk += (currentChunk ? ". " : "") + trimmedSentence
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + ".")
      }
      currentChunk = trimmedSentence
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + ".")
  }

  return chunks
}

export function createTranslationKey(text: string, sourceLanguage: string, targetLanguage: string): string {
  // Create a simple hash for caching
  const hash = btoa(text + sourceLanguage + targetLanguage)
    .replace(/[^a-zA-Z0-9]/g, "")
    .substring(0, 16)
  return `translation_${hash}`
}

export function validateLanguageCode(code: string): boolean {
  return /^[a-z]{2}-[A-Z]{2}$/.test(code) && isLanguageSupported(code)
}

// TTS helpers
export const DEFAULT_TTS_SPEAKER = "anushka"
export const SARVAM_TTS_MAX_CHARS = 500

export function chunkTTS(text: string, maxLength = 450): string[] {
  const chunks: string[] = []
  let current = ""
  for (const part of text.split(/(?<=[.!?])\s+/)) {
    const next = current ? `${current} ${part}` : part
    if (next.length <= maxLength) {
      current = next
    } else {
      if (current) chunks.push(current.slice(0, maxLength))
      current = part
      while (current.length > maxLength) {
        chunks.push(current.slice(0, maxLength))
        current = current.slice(maxLength)
      }
    }
  }
  if (current) chunks.push(current)
  return chunks.length ? chunks : [text.slice(0, maxLength)]
}
