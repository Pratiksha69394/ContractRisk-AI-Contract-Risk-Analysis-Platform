

import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RiskGauge from '@/components/risk-gauge'
import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface ContractDetails {
  id: string
  name: string
  uploadDate: string
  status: 'analyzed' | 'analyzing'
  riskScore: number
  riskLevel: 'high' | 'medium' | 'low' | 'pending'
  summary?: string
  keyRisks?: Array<{
    category: string
    description: string
    severity: string
  }>
  recommendations?: string[]
}

export default function Contract() {
  const { id } = useParams()
  const [contract, setContract] = useState<ContractDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContract()
  }, [id])

  const fetchContract = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/contracts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch contract')
      }
      
      const data = await response.json()
      setContract(data)
    } catch (error) {
      console.error('Failed to fetch contract:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Contract not found</p>
        </div>
      </main>
    )
  }

  const getSeverityColor = (severity: string): BadgeVariant => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'default'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legal': return <AlertCircle className="w-4 h-4" />
      case 'financial': return <AlertTriangle className="w-4 h-4" />
      case 'compliance': return <CheckCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{contract.name}</CardTitle>
                    <CardDescription>Uploaded on {contract.uploadDate}</CardDescription>
                  </div>
                  <Badge variant={contract.status === 'analyzed' ? 'default' : 'secondary'}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">{contract.summary || 'No summary available'}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="risks">
              <TabsList className="mb-4">
                <TabsTrigger value="risks">Key Risks</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="risks">
                <Card>
                  <CardHeader>
                    <CardTitle>Identified Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {contract.keyRisks?.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                          {getCategoryIcon(risk.category)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium capitalize">{risk.category} Risk</span>
                              <Badge variant={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-sm">{risk.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="recommendations">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {contract.recommendations?.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <p className="text-slate-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Risk Score</CardTitle>
                <CardDescription>Overall risk assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <RiskGauge score={contract.riskScore} level={contract.riskLevel} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

