
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FileText, Settings, User, Menu, X, BarChart3, Shield, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/contexts/AuthContext'

function LogOutIcon({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

export default function DashboardHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">ContractRisk AI</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <div
                onClick={() => navigate('/dashboard')}
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  isActive('/dashboard') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </div>
              <div
                onClick={() => navigate('/help')}
                className={`text-sm font-medium cursor-pointer transition-colors ${
                  isActive('/help') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Help
              </div>
            </nav>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings size={20} className="text-slate-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/compliance')}>
                    Compliance
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/about')}>
                    About
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User size={20} className="text-slate-600" />
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5 text-sm text-slate-600 border-b">
                    Signed in as<br />
                    <span className="font-medium text-slate-900">{user?.email || 'User'}</span>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOutIcon size={16} className="mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? (
                <X size={20} className="text-slate-600" />
              ) : (
                <Menu size={20} className="text-slate-600" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/50" 
            onClick={closeMobileMenu}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-[280px] sm:w-[320px] bg-white shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1.5 rounded">
                  <FileText size={18} className="text-white" />
                </div>
                <span className="font-bold text-slate-900">ContractRisk AI</span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
                <X size={20} className="text-slate-600" />
              </Button>
            </div>
            <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
              <div
                onClick={() => handleNavigation('/dashboard')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText size={18} />
                Dashboard
              </div>
              <div
                onClick={() => handleNavigation('/analytics')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/analytics') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BarChart3 size={18} />
                Analytics
              </div>
              <div
                onClick={() => handleNavigation('/compliance')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/compliance') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Shield size={18} />
                Compliance
              </div>
              <div
                onClick={() => handleNavigation('/about')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/about') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Info size={18} />
                About
              </div>
              <div
                onClick={() => handleNavigation('/help')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/help') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Settings size={18} />
                Help
              </div>
              <div
                onClick={() => handleNavigation('/settings')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Settings size={18} />
                Settings
              </div>
              <div
                onClick={() => handleNavigation('/profile')}
                className={`px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 ${
                  isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User size={18} />
                Profile
              </div>
            </nav>
            <div className="p-4 border-t">
              <div
                onClick={handleLogout}
                className="px-3 py-2.5 rounded-lg cursor-pointer font-medium flex items-center gap-3 text-red-600 hover:bg-red-50"
              >
                <LogOutIcon size={18} />
                Sign Out
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

