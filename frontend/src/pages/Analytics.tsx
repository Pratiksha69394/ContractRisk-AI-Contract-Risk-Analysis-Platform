import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Analytics() {
  const stats = [
    { title: 'Total Contracts', value: '156', change: '+12%', trend: 'up' },
    { title: 'High Risk', value: '23', change: '-5%', trend: 'down' },
    { title: 'Avg Risk Score', value: '42', change: '+3%', trend: 'up' },
    { title: 'Compliance Score', value: '87%', change: '+2%', trend: 'up' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Analytics Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="pb-2">
                <CardDescription>{stat.title}</CardDescription>
                <CardTitle className="text-3xl font-bold">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Overview of contract risk levels across your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-slate-500">
              Chart placeholder - integrate with Recharts for visualization
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

