"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calculator, Shield, DollarSign, Users, Home } from "lucide-react"

interface CoverageResult {
  lifeInsurance: number
  healthInsurance: number
  autoInsurance: number
  homeInsurance: number
  totalPremium: number
}

export function CoverageCalculator() {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    dependents: "",
    homeValue: "",
    carValue: "",
    healthCondition: "",
    smokingStatus: "",
  })
  const [result, setResult] = useState<CoverageResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const calculateCoverage = () => {
    setIsCalculating(true)

    // Simulate calculation delay
    setTimeout(() => {
      const age = Number.parseInt(formData.age) || 0
      const income = Number.parseInt(formData.income) || 0
      const dependents = Number.parseInt(formData.dependents) || 0
      const homeValue = Number.parseInt(formData.homeValue) || 0
      const carValue = Number.parseInt(formData.carValue) || 0

      // Basic calculation logic (simplified for demo)
      const lifeMultiplier = dependents > 0 ? 10 : 5
      const lifeInsurance = income * lifeMultiplier

      const healthBase = age < 30 ? 2000 : age < 50 ? 3000 : 4000
      const healthInsurance = formData.smokingStatus === "yes" ? healthBase * 1.5 : healthBase

      const autoInsurance = carValue * 0.02
      const homeInsurance = homeValue * 0.003

      const totalPremium = lifeInsurance * 0.001 + healthInsurance + autoInsurance + homeInsurance

      setResult({
        lifeInsurance,
        healthInsurance,
        autoInsurance,
        homeInsurance,
        totalPremium,
      })
      setIsCalculating(false)
    }, 1500)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <span>Insurance Coverage Calculator</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Calculate your recommended insurance coverage based on your personal and financial situation.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Personal Information</span>
              </h3>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income">Annual Income</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Enter annual income"
                  value={formData.income}
                  onChange={(e) => handleInputChange("income", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  type="number"
                  placeholder="Number of dependents"
                  value={formData.dependents}
                  onChange={(e) => handleInputChange("dependents", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="health">Health Condition</Label>
                <Select
                  value={formData.healthCondition}
                  onValueChange={(value) => handleInputChange("healthCondition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select health condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smoking">Do you smoke?</Label>
                <Select
                  value={formData.smokingStatus}
                  onValueChange={(value) => handleInputChange("smokingStatus", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select smoking status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Asset Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center space-x-2">
                <Home className="h-4 w-4" />
                <span>Asset Information</span>
              </h3>

              <div className="space-y-2">
                <Label htmlFor="homeValue">Home Value</Label>
                <Input
                  id="homeValue"
                  type="number"
                  placeholder="Enter home value"
                  value={formData.homeValue}
                  onChange={(e) => handleInputChange("homeValue", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carValue">Car Value</Label>
                <Input
                  id="carValue"
                  type="number"
                  placeholder="Enter car value"
                  value={formData.carValue}
                  onChange={(e) => handleInputChange("carValue", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button
            onClick={calculateCoverage}
            className="w-full"
            disabled={isCalculating || !formData.age || !formData.income}
          >
            {isCalculating ? "Calculating..." : "Calculate Coverage"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span>Recommended Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-700">Life Insurance</span>
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(result.lifeInsurance)}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Health Insurance</span>
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-green-900">{formatCurrency(result.healthInsurance)}</p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-purple-700">Auto Insurance</span>
                  <DollarSign className="h-4 w-4 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-purple-900">{formatCurrency(result.autoInsurance)}</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-orange-700">Home Insurance</span>
                  <Home className="h-4 w-4 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-900">{formatCurrency(result.homeInsurance)}</p>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Estimated Annual Premium</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {formatCurrency(result.totalPremium)}
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Note:</strong> These are simplified calculations for demonstration purposes. Actual insurance
                needs and premiums vary based on many factors including health history, location, credit score, and
                specific policy terms. Consult with licensed insurance agents for accurate quotes and personalized
                recommendations.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
