"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getSarvamClient } from "@/lib/sarvam/client"
import { getSarvamLanguageCode, chunkText, createTranslationKey } from "@/lib/sarvam/utils"

interface LanguageContextType {
  currentLanguage: string
  setLanguage: (language: string) => Promise<void>
  translate: (text: string, targetLanguage?: string) => Promise<string>
  translateBatch: (texts: string[], targetLanguage?: string) => Promise<string[]>
  isTranslating: boolean
  translationCache: Map<string, string>
  clearCache: () => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  defaultLanguage?: string
}

export function LanguageProvider({ children, defaultLanguage = "en-IN" }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(defaultLanguage)
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationCache] = useState(new Map<string, string>())

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language")
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  const setLanguage = useCallback(async (language: string) => {
    setCurrentLanguage(language)
    localStorage.setItem("preferred-language", language)
  }, [])

  const translate = useCallback(
    async (text: string, targetLanguage?: string): Promise<string> => {
      const target = targetLanguage || currentLanguage

      // Don't translate if target is English or same as source
      if (target === "en-IN" || !text.trim()) {
        return text
      }

      // Check cache first
      const cacheKey = createTranslationKey(text, "en-IN", target)
      const cached = translationCache.get(cacheKey)
      if (cached) {
        return cached
      }

      setIsTranslating(true)
      try {
        const sarvamClient = getSarvamClient()
        const sourceCode = getSarvamLanguageCode("en-IN")
        const targetCode = getSarvamLanguageCode(target)

        // Handle long text by chunking
        const chunks = chunkText(text, 800) // Sarvam has 1000 char limit, use 800 for safety
        const translatedChunks: string[] = []

        for (const chunk of chunks) {
          const translated = await sarvamClient.translate({
            input: chunk,
            source_language_code: sourceCode,
            target_language_code: targetCode,
            mode: "formal",
          })
          translatedChunks.push(translated)
        }

        const result = translatedChunks.join(" ")

        // Cache the result
        translationCache.set(cacheKey, result)

        return result
      } catch (error) {
        console.error("Translation error:", error)
        return text // Return original text on error
      } finally {
        setIsTranslating(false)
      }
    },
    [currentLanguage, translationCache],
  )

  const translateBatch = useCallback(
    async (texts: string[], targetLanguage?: string): Promise<string[]> => {
      const target = targetLanguage || currentLanguage

      if (target === "en-IN") {
        return texts
      }

      setIsTranslating(true)
      try {
        const results = await Promise.all(texts.map((text) => translate(text, target)))
        return results
      } finally {
        setIsTranslating(false)
      }
    },
    [currentLanguage, translate],
  )

  const clearCache = useCallback(() => {
    translationCache.clear()
  }, [translationCache])

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    translate,
    translateBatch,
    isTranslating,
    translationCache,
    clearCache,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Hook for translating static text
export function useTranslation(text: string, targetLanguage?: string) {
  const { translate, currentLanguage } = useLanguage()
  const [translatedText, setTranslatedText] = useState(text)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const target = targetLanguage || currentLanguage

    if (target === "en-IN") {
      setTranslatedText(text)
      return
    }

    setIsLoading(true)
    translate(text, target)
      .then(setTranslatedText)
      .finally(() => setIsLoading(false))
  }, [text, targetLanguage, currentLanguage, translate])

  return { translatedText, isLoading }
}

// Hook for batch translation
export function useBatchTranslation(texts: string[], targetLanguage?: string) {
  const { translateBatch, currentLanguage } = useLanguage()
  const [translatedTexts, setTranslatedTexts] = useState(texts)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const target = targetLanguage || currentLanguage

    if (target === "en-IN") {
      setTranslatedTexts(texts)
      return
    }

    setIsLoading(true)
    translateBatch(texts, target)
      .then(setTranslatedTexts)
      .finally(() => setIsLoading(false))
  }, [texts, targetLanguage, currentLanguage, translateBatch])

  return { translatedTexts, isLoading }
}
