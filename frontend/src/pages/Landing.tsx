
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import LoginForm from '@/components/LoginForm'
import RegisterForm from '@/components/RegisterForm'
import { Shield, FileText, TrendingUp, Users } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('login')

  const handleAuthSuccess = () => {
    // Check if there's a return URL saved
    const from = location.state?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">ContractRisk</span>
            </div>
            <Button variant="outline" onClick={() => setActiveTab('login')}>
              Sign In
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI-Powered Contract
                <span className="text-blue-600"> Risk Analysis</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Analyze and manage contract risks with advanced AI technology.
                Identify potential issues before they become problems.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <FileText className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
                  <p className="text-gray-600 text-sm">AI-powered contract review and risk assessment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Risk Scoring</h3>
                  <p className="text-gray-600 text-sm">Quantified risk levels with detailed insights</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Compliance</h3>
                  <p className="text-gray-600 text-sm">Ensure regulatory compliance automatically</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">Team Collaboration</h3>
                  <p className="text-gray-600 text-sm">Share insights and collaborate seamlessly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Forms */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                    <TabsTrigger value="login" className="rounded-none">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="rounded-none">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                  <div className="p-6">
                    <TabsContent value="login" className="mt-0">
                      <LoginForm onSuccess={handleAuthSuccess} />
                    </TabsContent>
                    <TabsContent value="register" className="mt-0">
                      <RegisterForm onSuccess={handleAuthSuccess} />
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2026 ContractRisk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
