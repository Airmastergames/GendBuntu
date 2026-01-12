'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/auth-store'
import api from '@/lib/api'
import { Shield } from 'lucide-react'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.post('/auth/login', data)
      login(response.data)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-primary-900 to-dark-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-military-card border border-military rounded-lg shadow-military-lg p-8">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-500 rounded-full mb-4">
              <Shield className="w-8 h-8 text-dark-900" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              GendBuntu
            </h1>
            <p className="text-muted-foreground text-sm">
              Système de Gestion Gendarmerie Nationale
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-danger-900/20 border border-danger-500 text-danger-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email', { required: 'Email requis' })}
                className="w-full px-4 py-2 bg-dark-700 border border-military rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="gendarme@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                {...register('password', { required: 'Mot de passe requis' })}
                className="w-full px-4 py-2 bg-dark-700 border border-military rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-500 hover:bg-accent-600 text-dark-900 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <p>Accès réservé au personnel autorisé</p>
          </div>
        </div>
      </div>
    </div>
  )
}
