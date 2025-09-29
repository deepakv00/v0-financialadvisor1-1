"use client"

import { useState, useCallback, useRef } from "react"
import { getSarvamClient } from "@/lib/sarvam/client"
import { getSarvamLanguageCode, getAvailableSpeakers } from "@/lib/sarvam/utils"
import { useLanguage } from "@/contexts/language-context"

interface TTSOptions {
  language?: string
  speaker?: string
  autoTranslate?: boolean
  pace?: number
  pitch?: number
  loudness?: number
}

interface TTSState {
  isLoading: boolean
  isPlaying: boolean
  error: string | null
  audioUrl: string | null
}

export function useTextToSpeech(options: TTSOptions = {}) {
  const { currentLanguage, translate } = useLanguage()
  const [state, setState] = useState<TTSState>({
    isLoading: false,
    isPlaying: false,
    error: null,
    audioUrl: null,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const targetLanguage = options.language || currentLanguage
  const availableSpeakers = getAvailableSpeakers(targetLanguage)
  const selectedSpeaker = options.speaker || availableSpeakers[0] || "meera"

  const generateSpeech = useCallback(
    async (text: string) => {
      if (!text.trim()) return

      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const sarvamClient = getSarvamClient()
        const languageCode = getSarvamLanguageCode(targetLanguage)

        // Translate text if needed
        let finalText = text
        if (options.autoTranslate !== false && targetLanguage !== "en-IN") {
          finalText = await translate(text, targetLanguage)
        }

        // Generate speech
        const audioData = await sarvamClient.textToSpeech({
          inputs: [finalText],
          target_language_code: languageCode,
          speaker: selectedSpeaker,
          pace: options.pace || 1.0,
          pitch: options.pitch || 0,
          loudness: options.loudness || 1.0,
        })

        if (audioData && audioData.length > 0) {
          // Clean up previous audio URL
          if (state.audioUrl) {
            URL.revokeObjectURL(state.audioUrl)
          }

          // Convert base64 to blob URL
          const audioBlob = new Blob([Uint8Array.from(atob(audioData[0]), (c) => c.charCodeAt(0))], {
            type: "audio/wav",
          })
          const url = URL.createObjectURL(audioBlob)

          setState((prev) => ({
            ...prev,
            isLoading: false,
            audioUrl: url,
            error: null,
          }))

          return url
        }
      } catch (error) {
        console.error("TTS Error:", error)
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "TTS generation failed",
        }))
      }
    },
    [targetLanguage, selectedSpeaker, translate, options, state.audioUrl],
  )

  const play = useCallback(
    async (text?: string) => {
      if (text) {
        const url = await generateSpeech(text)
        if (url && audioRef.current) {
          audioRef.current.src = url
          audioRef.current.play()
          setState((prev) => ({ ...prev, isPlaying: true }))
        }
      } else if (state.audioUrl && audioRef.current) {
        audioRef.current.play()
        setState((prev) => ({ ...prev, isPlaying: true }))
      }
    },
    [generateSpeech, state.audioUrl],
  )

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState((prev) => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setState((prev) => ({ ...prev, isPlaying: false }))
    }
  }, [])

  const cleanup = useCallback(() => {
    if (state.audioUrl) {
      URL.revokeObjectURL(state.audioUrl)
    }
    setState({
      isLoading: false,
      isPlaying: false,
      error: null,
      audioUrl: null,
    })
  }, [state.audioUrl])

  // Create audio element if it doesn't exist
  if (!audioRef.current && typeof window !== "undefined") {
    audioRef.current = new Audio()
    audioRef.current.onended = () => setState((prev) => ({ ...prev, isPlaying: false }))
    audioRef.current.onpause = () => setState((prev) => ({ ...prev, isPlaying: false }))
    audioRef.current.onplay = () => setState((prev) => ({ ...prev, isPlaying: true }))
  }

  return {
    ...state,
    generateSpeech,
    play,
    pause,
    stop,
    cleanup,
    availableSpeakers,
    selectedSpeaker,
    targetLanguage,
  }
}
