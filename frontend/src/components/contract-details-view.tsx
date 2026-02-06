import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import RiskGaugeDetailed from '@/components/risk-gauge-detailed'
import { AlertTriangle, CheckCircle, AlertCircle, FileText } from 'lucide-react'

interface ContractDetailsViewProps {
  contract: {
    id: string
    name: string
    uploadDate: string
    status: string
    riskScore: number
    riskLevel: string
    summary?: string
    keyRisks?: Array<{ category: string; description: string; severity: string }>
    recommendations?: string[]
  }
}

export default function ContractDetailsView({ contract }: ContractDetailsViewProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'low': return 'bg-green-100 text-green-700'
      default: return 'bg-slate-100 text-slate-700'
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
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{contract.name}</CardTitle>
                  <p className="text-slate-500">Uploaded on {contract.uploadDate}</p>
                </div>
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
                      <Badge className={getSeverityColor(risk.severity)}>{risk.severity}</Badge>
                    </div>
                    <p className="text-slate-600 text-sm">{risk.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Risk Assessment</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <RiskGaugeDetailed score={contract.riskScore} level={contract.riskLevel} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

