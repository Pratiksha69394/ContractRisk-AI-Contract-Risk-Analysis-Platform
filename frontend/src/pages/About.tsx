import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, FileText, Zap, Lock } from 'lucide-react'

export default function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About ContractRisk AI</h1>
          <p className="text-lg text-slate-600">
            Empowering organizations with AI-driven contract risk analysis and management solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Risk Identification</CardTitle>
              <CardDescription>
                Automatically identify legal, financial, compliance, and operational risks in your contracts using advanced AI.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Smart Analysis</CardTitle>
              <CardDescription>
                Get detailed analysis reports with actionable recommendations to mitigate identified risks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Real-time Insights</CardTitle>
              <CardDescription>
                Monitor your contract portfolio with real-time risk scores and trend analysis.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-10 h-10 text-blue-600 mb-2" />
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your contracts are processed securely with enterprise-grade encryption and privacy protection.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button asChild size="lg">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}

