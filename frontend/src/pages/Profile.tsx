import * as React from 'react'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, User, Mail, Building } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { authenticatedApiRequest } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

interface UserProfile {
  name: string
  email: string
  role: string
  company?: string
}

export default function Profile() {
  const { user, updateUser } = useAuth()
  const { toast } = useToast()
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    company: ''
  })

  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const data = await authenticatedApiRequest<{ name: string; email: string; role?: string; company?: string }>('/api/auth/me')
      setUserData({
        name: data.name,
        email: data.email,
        role: data.role || 'User',
        company: data.company || ''
      })
      setFormData({
        name: data.name || '',
        company: data.company || ''
      })
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Name is required',
        variant: 'destructive'
      })
      return
    }

    setSaving(true)
    try {
      const updatedUser = await authenticatedApiRequest<UserProfile>('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({
          name: formData.name,
          company: formData.company
        })
      })
      
      setUserData(updatedUser)
      updateUser(updatedUser)
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      })
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setSaving(false)
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  const displayUser = userData || {
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    role: user?.role || 'User',
    company: ''
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Profile</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardContent className="pt-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback>{getInitials(displayUser.name)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{displayUser.name}</h2>
                <p className="text-slate-600">{displayUser.role}</p>
                <Button variant="outline" className="mt-4 w-full">Change Photo</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={displayUser.email} 
                  disabled 
                  className="bg-slate-50" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Company
                </Label>
                <Input 
                  id="company" 
                  value={formData.company} 
                  onChange={handleInputChange}
                  placeholder="Enter your company name"
                />
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

