'use client'

import { Bell, Search } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="h-16 bg-military-card border-b border-military flex items-center justify-between px-6">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-military rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-danger-500 rounded-full"></span>
        </button>

        {user && (
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">
                {user.prenom} {user.nom}
              </p>
              <p className="text-xs text-muted-foreground">{user.role}</p>
            </div>
            <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-foreground">
                {user.prenom[0]}{user.nom[0]}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
