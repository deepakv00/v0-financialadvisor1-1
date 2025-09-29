"use client"

import { Button } from "@/components/ui/button"
import { Volume2, Loader2, Pause } from "lucide-react"
import { useTextToSpeech } from "@/hooks/use-text-to-speech"

interface TTSButtonProps {
  text: string
  language?: string
  speaker?: string
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  autoTranslate?: boolean
}

export function TTSButton({
  text,
  language,
  speaker,
  variant = "ghost",
  size = "sm",
  className = "",
  autoTranslate = true,
}: TTSButtonProps) {
  const { isLoading, isPlaying, play, pause } = useTextToSpeech({
    language,
    speaker,
    autoTranslate,
  })

  const handleClick = () => {
    if (isPlaying) {
      pause()
    } else {
      play(text)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading || !text.trim()}
      className={className}
      title={isLoading ? "Generating speech..." : isPlaying ? "Pause" : "Listen"}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <Pause className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {size !== "icon" && <span className="ml-1">{isLoading ? "Loading..." : isPlaying ? "Pause" : "Listen"}</span>}
    </Button>
  )
}
