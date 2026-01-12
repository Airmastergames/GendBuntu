'use client'

import { useAuthStore } from '@/store/auth-store'
import { Calendar, FileText, Users, Radio, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()

  const stats = [
    { label: 'Services planifiés', value: '12', icon: Calendar, color: 'text-accent-500' },
    { label: 'PV en attente', value: '5', icon: FileText, color: 'text-primary-400' },
    { label: 'Interventions actives', value: '3', icon: Radio, color: 'text-success-500' },
    { label: 'Incidents graves', value: '1', icon: AlertTriangle, color: 'text-danger-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Bienvenue, {user?.prenom} {user?.nom}
        </h1>
        <p className="text-muted-foreground">
          {user?.grade} • {user?.unite?.nom || 'Aucune unité'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-military-card border border-military rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-military-card border border-military rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/pulsar"
            className="p-4 bg-dark-800 border border-military rounded-lg hover:border-accent-500 transition-colors"
          >
            <h3 className="font-medium text-foreground mb-1">Créer un service</h3>
            <p className="text-sm text-muted-foreground">Planifier un nouveau service</p>
          </a>
          <a
            href="/bdsp"
            className="p-4 bg-dark-800 border border-military rounded-lg hover:border-accent-500 transition-colors"
          >
            <h3 className="font-medium text-foreground mb-1">Nouvelle intervention</h3>
            <p className="text-sm text-muted-foreground">Créer une intervention BDSP</p>
          </a>
          <a
            href="/compte-rendu"
            className="p-4 bg-dark-800 border border-military rounded-lg hover:border-accent-500 transition-colors"
          >
            <h3 className="font-medium text-foreground mb-1">Compte-rendu</h3>
            <p className="text-sm text-muted-foreground">Rédiger un compte-rendu</p>
          </a>
        </div>
      </div>
    </div>
  )
}
