"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Globe, Check } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

const SUPPORTED_LANGUAGES = [
  { code: "en-IN", name: "English", nativeName: "English" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी" },
  { code: "bn-IN", name: "Bengali", nativeName: "বাংলা" },
  { code: "gu-IN", name: "Gujarati", nativeName: "ગુજરાતી" },
  { code: "kn-IN", name: "Kannada", nativeName: "ಕನ್ನಡ" },
  { code: "ml-IN", name: "Malayalam", nativeName: "മലയാളം" },
  { code: "mr-IN", name: "Marathi", nativeName: "मराठी" },
  { code: "od-IN", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
  { code: "pa-IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు" },
]

interface LanguageSelectorProps {
  variant?: "default" | "compact"
  className?: string
}

export function LanguageSelector({ variant = "default", className = "" }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, isTranslating } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const currentLang = SUPPORTED_LANGUAGES.find((lang) => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0]

  const handleLanguageChange = async (languageCode: string) => {
    await setLanguage(languageCode)
    setIsOpen(false)
  }

  if (variant === "compact") {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 px-2 ${className}`} disabled={isTranslating}>
            <Globe className="h-4 w-4 mr-1" />
            <span className="text-xs font-medium">{currentLang.code.split("-")[0].toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">Select Language</div>
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-xs text-muted-foreground">{language.nativeName}</span>
              </div>
              {currentLanguage === language.code && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`flex items-center space-x-2 ${className}`} disabled={isTranslating}>
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLang.name}</span>
          <span className="sm:hidden">{currentLang.code.split("-")[0].toUpperCase()}</span>
          {isTranslating && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Translating...
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-semibold">Choose Language</p>
          <p className="text-xs text-muted-foreground">Powered by Sarvam AI for Indian languages</p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className="flex items-center justify-between cursor-pointer py-3"
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.name}</span>
                <span className="text-sm text-muted-foreground">{language.nativeName}</span>
              </div>
              {currentLanguage === language.code && <Check className="h-4 w-4 text-accent" />}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
