'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

export default function LoginPage() {
  const router    = useRouter()
  const { setAuth } = useAuthStore()
  const [form,    setForm]    = useState({ correo: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.correo || !form.password) { setError('Completa todos los campos'); return }
    setLoading(true)
    setError('')
    try {
      const res = await authService.login(form)
      setAuth(res.usuario, res.access_token)
      authService.saveSession(res.access_token, res.usuario)
      router.push('/')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center p-6"
         style={{ background: 'var(--gray-100)' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg border animate-fade-up"
           style={{ borderColor: 'var(--gray-200)' }}>

        <h1 className="font-display text-2xl font-bold text-center mb-6"
            style={{ color: 'var(--crimson-dark)' }}>
          Inicia sesión
        </h1>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                   style={{ color: 'var(--gray-500)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={form.correo}
              onChange={(e) => setForm(f => ({ ...f, correo: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="input-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                   style={{ color: 'var(--gray-500)' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="input-base"
            />
          </div>

          {error && (
            <p className="text-sm text-center font-medium animate-fade-in" style={{ color: '#E74C3C' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm mt-1 disabled:opacity-60">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--gray-500)' }}>
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="font-semibold hover:underline" style={{ color: 'var(--crimson)' }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}