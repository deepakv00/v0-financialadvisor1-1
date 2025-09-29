"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Bot, User, Minimize2, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useLanguage } from "@/contexts/language-context"
import { TTSButton } from "@/components/ui/tts-button"
import { LanguageSelector } from "@/components/ui/language-selector"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
}

interface ChatAssistantProps {
  context: "financial" | "loan" | "investment" | "insurance" | "general"
  className?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ChatAssistant({ context, className = "", isOpen, onOpenChange }: ChatAssistantProps) {
  const [internalMinimized, setInternalMinimized] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [showLanguageSelector, setShowLanguageSelector] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { currentLanguage, translate } = useLanguage()

  const isMinimized = isOpen !== undefined ? !isOpen : internalMinimized
  const setIsMinimized = onOpenChange ? (minimized: boolean) => onOpenChange(!minimized) : setInternalMinimized

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const setWelcomeMessage = async () => {
      const welcomeText = getWelcomeMessage(context)
      const translatedWelcome = currentLanguage !== "en-IN" ? await translate(welcomeText) : welcomeText

      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: translatedWelcome,
        createdAt: new Date(),
      }
      setMessages([welcomeMessage])
    }

    setWelcomeMessage()
  }, [context, currentLanguage, translate])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const getWelcomeMessage = (context: string) => {
    const messages = {
      financial:
        "Hello! I'm your AI Financial Advisor powered by Google Gemini & Sarvam AI. I can help you with budgeting, savings strategies, retirement planning, and general financial guidance. What would you like to discuss?",
      loan: "Hi! I'm here to assist you with loan-related queries using advanced AI from Google Gemini & Sarvam AI. I can help you understand different loan types, EMI calculations, eligibility criteria, and debt management strategies. How can I help?",
      investment:
        "Welcome! I'm your AI Investment Advisor powered by Google Gemini & Sarvam AI. I can guide you through investment options, portfolio planning, risk assessment, and market insights. What investment topic interests you?",
      insurance:
        "Hello! I'm your AI Insurance Advisor using Google Gemini & Sarvam AI. I can help you understand insurance types, coverage needs, premium calculations, and claim processes. What insurance question do you have?",
      general:
        "Hi! I'm your Smart Financial Advisor AI powered by Google Gemini & Sarvam AI. I can assist you with financial planning, loans, investments, and insurance queries in multiple Indian languages. How can I help you today?",
    }
    return messages[context] || messages.general
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          context,
          language: currentLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("No response body")
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])

      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone

        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const data = JSON.parse(line.slice(2))
                if (data.type === "text-delta" && data.textDelta) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id ? { ...msg, content: msg.content + data.textDelta } : msg,
                    ),
                  )
                }
              } catch (e) {
                // Ignore parsing errors for malformed chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        createdAt: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  if (isMinimized) {
    return (
      <div className={`fixed bottom-40 right-4 z-50 ${className}`}>
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 shadow-lg bg-accent hover:bg-accent/90"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <Card className="w-full h-[500px] shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg flex items-center">
              <Bot className="h-5 w-5 mr-2 text-accent" />
              AI Financial Advisor
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                Gemini + Sarvam AI
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="h-8 w-8 p-0"
                title="Change Language"
              >
                <Globe className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsMinimized(true)} className="h-8 w-8 p-0">
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {showLanguageSelector && (
            <div className="mt-2 pt-2 border-t">
              <LanguageSelector variant="compact" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[420px]">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 ${
                    message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div
                    className={`max-w-[280px] p-3 rounded-lg text-sm ${
                      message.role === "user" ? "bg-accent text-accent-foreground ml-auto" : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <p className="whitespace-pre-wrap flex-1">{message.content}</p>
                      {message.role === "assistant" && message.content && (
                        <div className="ml-2 flex-shrink-0">
                          <TTSButton
                            text={message.content}
                            language={currentLanguage}
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                          />
                        </div>
                      )}
                    </div>
                    <div className="text-xs opacity-70 mt-1 flex items-center justify-between">
                      <span>{message.createdAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {currentLanguage !== "en-IN" && message.role === "assistant" && (
                        <Badge variant="outline" className="text-xs ml-2">
                          {currentLanguage.split("-")[0].toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted text-foreground p-3 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-current rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={
                  currentLanguage === "en-IN" ? "Ask me about financial planning..." : "वित्तीय योजना के बारे में पूछें..."
                }
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by Google Gemini & Sarvam AI. Supports{" "}
              {currentLanguage !== "en-IN" ? "multiple Indian languages" : "Hindi, Tamil, Telugu & more"}. AI responses
              are for educational purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
