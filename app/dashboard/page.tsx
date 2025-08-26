import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calculator, Shield, Users } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get user profile data
  const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", data.user.id).single()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="font-serif text-xl font-bold">Smart Financial Advisor</span>
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/profile" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <div className="container py-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">{data.user.email} • Your personalized financial dashboard</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile ? "Complete" : "Incomplete"}</div>
              <p className="text-xs text-muted-foreground">{profile ? "Profile set up" : "Complete your profile"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Type</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Free</div>
              <p className="text-xs text-muted-foreground">Basic financial guidance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Services Used</CardTitle>
              <Calculator className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Advisory services available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Login</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Today</div>
              <p className="text-xs text-muted-foreground">Welcome back!</p>
            </CardContent>
          </Card>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif">Financial Advisory</CardTitle>
              <CardDescription>Personal budgeting and financial planning</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/financial-advisory">Get Started</Link>
              </Button>
            </CardContent>
            <Badge className="absolute top-4 right-4" variant="secondary">
              Available
            </Badge>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Calculator className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif">Loan Advisory</CardTitle>
              <CardDescription>Loan eligibility and EMI calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/loan-advisory">Get Started</Link>
              </Button>
            </CardContent>
            <Badge className="absolute top-4 right-4" variant="secondary">
              Available
            </Badge>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <TrendingUp className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif">Investment Advisory</CardTitle>
              <CardDescription>Portfolio analysis and investment guidance</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/investment-advisory">Get Started</Link>
              </Button>
            </CardContent>
            <Badge className="absolute top-4 right-4" variant="secondary">
              Available
            </Badge>
          </Card>

          <Card className="relative overflow-hidden border-2 hover:border-accent/50 transition-colors">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif">Insurance Advisory</CardTitle>
              <CardDescription>Insurance planning and coverage analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/insurance-advisory">Get Started</Link>
              </Button>
            </CardContent>
            <Badge className="absolute top-4 right-4" variant="secondary">
              Available
            </Badge>
          </Card>
        </div>
      </div>
    </div>
  )
}
