"use client"

import type React from "react"

import { useTranslation, useBatchTranslation } from "@/contexts/language-context"
import { Skeleton } from "@/components/ui/skeleton"

interface TranslationWrapperProps {
  text: string
  targetLanguage?: string
  fallback?: React.ReactNode
  showSkeleton?: boolean
  className?: string
  children?: never
}

interface TranslationWrapperWithChildrenProps {
  text?: never
  targetLanguage?: string
  fallback?: React.ReactNode
  showSkeleton?: boolean
  className?: string
  children: string
}

type TranslationWrapperAllProps = TranslationWrapperProps | TranslationWrapperWithChildrenProps

export function TranslationWrapper({
  text,
  children,
  targetLanguage,
  fallback,
  showSkeleton = true,
  className = "",
}: TranslationWrapperAllProps) {
  const sourceText = text || children
  const { translatedText, isLoading } = useTranslation(sourceText!, targetLanguage)

  if (isLoading && showSkeleton) {
    return <Skeleton className={`h-4 w-full ${className}`} />
  }

  if (isLoading && fallback) {
    return <>{fallback}</>
  }

  return <span className={className}>{translatedText}</span>
}

// Utility component for translating multiple texts
interface BatchTranslationWrapperProps {
  texts: string[]
  targetLanguage?: string
  render: (translatedTexts: string[], isLoading: boolean) => React.ReactNode
}

export function BatchTranslationWrapper({ texts, targetLanguage, render }: BatchTranslationWrapperProps) {
  const { translatedTexts, isLoading } = useBatchTranslation(texts, targetLanguage)

  return <>{render(translatedTexts, isLoading)}</>
}
