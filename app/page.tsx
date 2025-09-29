import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, TrendingUp, Calculator, Users } from "lucide-react"
import Link from "next/link"
import { ChatAssistant } from "@/components/ai-chat/chat-assistant"
import { AuthButton } from "@/components/auth/auth-button"
import { LanguageSelector } from "@/components/ui/language-selector"
import { TranslationWrapper } from "@/components/ui/translation-wrapper"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="font-serif text-xl font-bold">
              <TranslationWrapper>Smart Financial Advisor</TranslationWrapper>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslationWrapper>About</TranslationWrapper>
            </Link>
            <Link
              href="#services"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslationWrapper>Services</TranslationWrapper>
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslationWrapper>Features</TranslationWrapper>
            </Link>
            <LanguageSelector variant="compact" />
            <AuthButton />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-4">
              <TranslationWrapper>AI-Powered Financial Advisory</TranslationWrapper>
            </Badge>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <TranslationWrapper>Your Smart Path to</TranslationWrapper>{" "}
              <span className="text-accent">
                <TranslationWrapper>Financial Success</TranslationWrapper>
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              <TranslationWrapper>
                Navigate your financial journey with confidence. Our AI-powered platform provides personalized advice
                for investments, loans, insurance, and comprehensive financial planning.
              </TranslationWrapper>
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                <Link href="/features">
                  <TranslationWrapper>Explore Features</TranslationWrapper>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <TranslationWrapper>Learn More</TranslationWrapper>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/50">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              <TranslationWrapper>About Smart Financial Advisor</TranslationWrapper>
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              <TranslationWrapper>
                We combine cutting-edge AI technology with proven financial expertise to deliver personalized,
                transparent, and educational financial guidance. Our platform demystifies complex financial decisions
                and empowers you to make informed choices about your financial future.
              </TranslationWrapper>
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                <TranslationWrapper>Secure & Trusted</TranslationWrapper>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <TranslationWrapper>
                  Bank-level security with transparent, educational guidance you can trust.
                </TranslationWrapper>
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                <TranslationWrapper>AI-Powered</TranslationWrapper>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <TranslationWrapper>
                  Advanced algorithms provide personalized recommendations for your unique situation.
                </TranslationWrapper>
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                <TranslationWrapper>Comprehensive Tools</TranslationWrapper>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <TranslationWrapper>
                  Complete suite of calculators and planning tools for all your financial needs.
                </TranslationWrapper>
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold">
                <TranslationWrapper>Expert Guidance</TranslationWrapper>
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                <TranslationWrapper>
                  Professional financial expertise accessible to everyone, anytime.
                </TranslationWrapper>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section id="services" className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              <TranslationWrapper>Core Services</TranslationWrapper>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              <TranslationWrapper>
                Comprehensive financial guidance across all aspects of your financial life
              </TranslationWrapper>
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif">
                  <TranslationWrapper>Financial Advisory</TranslationWrapper>
                </CardTitle>
                <CardDescription>
                  <TranslationWrapper>
                    Personal budgeting, savings strategies, and comprehensive financial planning
                  </TranslationWrapper>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <TranslationWrapper>Budget optimization</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Emergency fund planning</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Goal-based savings</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Retirement planning</TranslationWrapper>
                  </li>
                </ul>
              </CardContent>
              <Badge className="absolute top-4 right-4" variant="secondary">
                <TranslationWrapper>Demo Data</TranslationWrapper>
              </Badge>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Calculator className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif">
                  <TranslationWrapper>Loan Advisory</TranslationWrapper>
                </CardTitle>
                <CardDescription>
                  <TranslationWrapper>
                    Loan eligibility, EMI calculations, and debt management strategies
                  </TranslationWrapper>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <TranslationWrapper>Eligibility assessment</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>EMI calculators</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Loan comparisons</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Debt optimization</TranslationWrapper>
                  </li>
                </ul>
              </CardContent>
              <Badge className="absolute top-4 right-4" variant="secondary">
                <TranslationWrapper>Demo Data</TranslationWrapper>
              </Badge>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif">
                  <TranslationWrapper>Investment Advisory</TranslationWrapper>
                </CardTitle>
                <CardDescription>
                  <TranslationWrapper>
                    Stock analysis, mutual funds, and portfolio optimization guidance
                  </TranslationWrapper>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <TranslationWrapper>Risk profiling</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Portfolio analysis</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>SIP planning</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Market insights</TranslationWrapper>
                  </li>
                </ul>
              </CardContent>
              <Badge className="absolute top-4 right-4" variant="secondary">
                <TranslationWrapper>Demo Data</TranslationWrapper>
              </Badge>
            </Card>

            <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="font-serif">
                  <TranslationWrapper>Insurance Advisory</TranslationWrapper>
                </CardTitle>
                <CardDescription>
                  <TranslationWrapper>Life, health, and vehicle insurance planning and comparison</TranslationWrapper>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    • <TranslationWrapper>Coverage assessment</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Policy comparisons</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Premium optimization</TranslationWrapper>
                  </li>
                  <li>
                    • <TranslationWrapper>Claim guidance</TranslationWrapper>
                  </li>
                </ul>
              </CardContent>
              <Badge className="absolute top-4 right-4" variant="secondary">
                <TranslationWrapper>Demo Data</TranslationWrapper>
              </Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl">
              <TranslationWrapper>Ready to Transform Your Financial Future?</TranslationWrapper>
            </h2>
            <p className="mt-4 text-lg opacity-90">
              <TranslationWrapper>
                Join thousands of users who trust our AI-powered platform for their financial decisions.
              </TranslationWrapper>
            </p>
            <div className="mt-8">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <Link href="/features">
                  <TranslationWrapper>Let's Get Started</TranslationWrapper>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Assistant */}
      <ChatAssistant context="general" />

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                  <TrendingUp className="h-3 w-3" />
                </div>
                <span className="font-serif font-bold">
                  <TranslationWrapper>Smart Financial Advisor</TranslationWrapper>
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <TranslationWrapper>AI-powered financial guidance for a smarter financial future.</TranslationWrapper>
              </p>
            </div>
            <div>
              <h3 className="font-serif font-semibold">
                <TranslationWrapper>Services</TranslationWrapper>
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <TranslationWrapper>Financial Planning</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Loan Advisory</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Investment Guidance</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Insurance Planning</TranslationWrapper>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold">
                <TranslationWrapper>Resources</TranslationWrapper>
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <TranslationWrapper>Financial Calculators</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Educational Content</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Market Insights</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Planning Tools</TranslationWrapper>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif font-semibold">
                <TranslationWrapper>Legal</TranslationWrapper>
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li>
                  <TranslationWrapper>Privacy Policy</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Terms of Service</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Disclaimers</TranslationWrapper>
                </li>
                <li>
                  <TranslationWrapper>Contact Us</TranslationWrapper>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>
              <TranslationWrapper>
                © 2025 Smart Financial Advisor. All rights reserved. This platform uses demo data for educational
                purposes only.
              </TranslationWrapper>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
