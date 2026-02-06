import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardHeader from '@/components/dashboard-header'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import About from '@/pages/About'
import Analytics from '@/pages/Analytics'
import Compliance from '@/pages/Compliance'
import Contract from '@/pages/Contract'
import Help from '@/pages/Help'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'
import Settings from '@/pages/Settings'

function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <DashboardHeader />
      {children}
    </>
  )
}

function App() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect authenticated users away from landing page to dashboard
  const isAuthPage = location.pathname === '/'

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Landing />
              )
            }
          />

          {/* Protected routes - require authentication */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/contract/:id"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Contract />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Analytics />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Compliance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Notifications />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Settings />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Public info pages - accessible without auth */}
          <Route
            path="/about"
            element={
              <DashboardLayout>
                <About />
              </DashboardLayout>
            }
          />
          <Route
            path="/help"
            element={
              <DashboardLayout>
                <Help />
              </DashboardLayout>
            }
          />

          {/* Catch all - redirect to appropriate page */}
          <Route
            path="*"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  )
}

export default App

