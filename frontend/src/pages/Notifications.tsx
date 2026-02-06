import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Bell, Check, X } from 'lucide-react'

const notifications = [
  {
    id: 1,
    title: 'Contract Analysis Complete',
    message: 'Service Agreement - Acme Corp has been analyzed successfully.',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 2,
    title: 'High Risk Detected',
    message: 'NDA - Tech Partners Inc has been flagged as high risk.',
    time: '1 day ago',
    read: false,
    type: 'warning'
  },
  {
    id: 3,
    title: 'Weekly Report Ready',
    message: 'Your weekly contract risk report is ready for review.',
    time: '3 days ago',
    read: true,
    type: 'info'
  }
]

export default function Notifications() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <Button variant="outline">Mark all as read</Button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.read ? 'opacity-60' : ''}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Bell className={`w-5 h-5 ${
                      notification.type === 'success' ? 'text-green-600' :
                      notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className="text-sm text-slate-500">{notification.time}</span>
                    </div>
                    <p className="text-slate-600">{notification.message}</p>
                    {!notification.read && (
                      <Badge variant="secondary" className="mt-2">New</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

