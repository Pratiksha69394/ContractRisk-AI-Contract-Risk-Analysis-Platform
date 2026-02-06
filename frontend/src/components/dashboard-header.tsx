import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FileText, Settings, User, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = () => {
    logout()
    // Use window.location for a clean redirect
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FileText size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 hidden sm:block">ContractRisk AI</h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  isActive('/dashboard') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/help"
                className={`text-sm font-medium transition-colors ${
                  isActive('/help') ? 'text-blue-600' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Help
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings size={20} className="text-slate-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/compliance">Compliance</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/about">About</Link>
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} className="text-slate-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-3 mt-8">
                  <Link
                    to="/dashboard"
                    className={`px-2 py-2 rounded font-medium ${
                      isActive('/dashboard') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/analytics"
                    className={`px-2 py-2 rounded font-medium ${
                      isActive('/analytics') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link
                    to="/help"
                    className={`px-2 py-2 rounded font-medium ${
                      isActive('/help') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Help
                  </Link>
                  <Link
                    to="/settings"
                    className={`px-2 py-2 rounded font-medium ${
                      isActive('/settings') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-2 py-2 rounded font-medium ${
                      isActive('/profile') ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-2 py-2 rounded font-medium text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

