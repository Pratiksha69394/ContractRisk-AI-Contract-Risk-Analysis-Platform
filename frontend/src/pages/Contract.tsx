import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge, type BadgeVariant } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RiskGauge from '@/components/risk-gauge'
import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'
import { authenticatedApiRequest } from '@/lib/api'

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
      const data = await authenticatedApiRequest<ContractDetails>('/api/contracts/' + id)
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
          <p className="text-center">Loading...</p>
        </div>
      </main>
    )
  }

  if (!contract) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8">
          <p className="text-center">Contract not found</p>
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
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-4 sm:mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-4 sm:mb-6">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl">{contract.name}</CardTitle>
                    <CardDescription>Uploaded on {contract.uploadDate}</CardDescription>
                  </div>
                  <Badge variant={contract.status === 'analyzed' ? 'default' : 'secondary'} className="self-start sm:self-auto">
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm sm:text-base">{contract.summary || 'No summary available'}</p>
              </CardContent>
            </Card>

            <Tabs defaultValue="risks">
              <TabsList className="mb-4 w-full grid grid-cols-2">
                <TabsTrigger value="risks" className="text-sm">Key Risks</TabsTrigger>
                <TabsTrigger value="recommendations" className="text-sm">Recommendations</TabsTrigger>
              </TabsList>

              <TabsContent value="risks">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Identified Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {contract.keyRisks && contract.keyRisks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                          {getCategoryIcon(risk.category)}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                              <span className="font-medium capitalize text-sm">{risk.category} Risk</span>
                              <Badge variant={getSeverityColor(risk.severity)} className="text-xs">
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
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 sm:space-y-3">
                      {contract.recommendations && contract.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-slate-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-700 text-sm">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="sticky top-16 sm:top-20">
              <CardHeader>
                <CardTitle className="text-lg">Risk Score</CardTitle>
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

