"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TranslationWrapper } from "@/components/ui/translation-wrapper"

export function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" asChild>
          <a href="/auth/login">
            <TranslationWrapper>Login</TranslationWrapper>
          </a>
        </Button>
        <Button asChild>
          <a href="/auth/sign-up">
            <TranslationWrapper>Sign Up</TranslationWrapper>
          </a>
        </Button>
      </div>
    )
  }

  const initials = user.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col space-y-1 p-2">
          <p className="text-sm font-medium leading-none">{user.email}</p>
          <p className="text-xs leading-none text-muted-foreground">
            <TranslationWrapper>Financial Advisor User</TranslationWrapper>
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/profile")}>
          <TranslationWrapper>Profile Settings</TranslationWrapper>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>
          <TranslationWrapper>Dashboard</TranslationWrapper>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <TranslationWrapper>Sign Out</TranslationWrapper>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
