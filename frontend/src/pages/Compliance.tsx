import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Compliance() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Compliance Dashboard</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Monitor your organization's compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">GDPR Compliance</h4>
                    <p className="text-sm text-slate-600">Data protection requirements</p>
                  </div>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">SOC 2</h4>
                    <p className="text-sm text-slate-600">Security controls assessment</p>
                  </div>
                  <Badge variant="default">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Contract Standards</h4>
                    <p className="text-sm text-slate-600">Internal policy compliance</p>
                  </div>
                  <Badge variant="secondary">Review Needed</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

