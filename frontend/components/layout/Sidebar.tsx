'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Mail,
  Users,
  Radio,
  ClipboardList,
  AlertTriangle,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react'
import { clsx } from 'clsx'

const menuItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/pulsar', label: 'Pulsar', icon: Calendar },
  { href: '/lrpgn', label: 'LRPGN', icon: FileText },
  { href: '/messagerie', label: 'Messagerie', icon: Mail },
  { href: '/annuaire', label: 'Annuaire', icon: Users },
  { href: '/bdsp', label: 'BDSP', icon: Radio },
  { href: '/compte-rendu', label: 'Compte-rendu', icon: ClipboardList },
  { href: '/eventgrave', label: 'EventGrave', icon: AlertTriangle },
  { href: '/admin', label: 'Administration', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  return (
    <div className="w-64 bg-military-card border-r border-military h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-military">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-dark-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">GendBuntu</h1>
            <p className="text-xs text-muted-foreground">Système de Gestion</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-military bg-dark-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.grade} • {user.unite?.nom || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-accent-500 text-dark-900 font-medium'
                  : 'text-muted-foreground hover:bg-dark-800 hover:text-foreground'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-military">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-dark-800 hover:text-foreground transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  )
}
