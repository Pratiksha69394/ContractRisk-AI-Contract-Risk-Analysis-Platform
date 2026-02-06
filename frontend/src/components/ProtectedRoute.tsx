import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, type ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Check auth state on mount
    const token = localStorage.getItem('token')
    if (!token) {
      setHasChecked(true)
    } else {
      // If token exists, isLoading should complete soon
      const timer = setTimeout(() => setHasChecked(true), 100)
      return () => clearTimeout(timer)
    }
  }, [user])

  // Show loading only while checking
  if (!hasChecked || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/" state={{ from: location }} replace />
  }

  return <>{children}</>
}

