'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import '@/styles/Auth.css'

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
    <div className="auth-container">
      <div className="auth-card animate-fade-up">
        
        <div className="auth-header">
          <div className="auth-icon-wrap">🔑</div>
          <h1 className="auth-title">Bienvenido</h1>
          <p className="auth-subtitle">Inicia sesión en Pricely</p>
        </div>

        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={form.correo}
              onChange={(e) => setForm(f => ({ ...f, correo: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="form-input"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 animate-shake">
              <p className="text-xs text-center font-bold uppercase tracking-tight" style={{ color: '#E74C3C' }}>
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="auth-btn"
          >
            {loading ? 'Ingresando...' : 'Entrar'}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            ¿Eres nuevo aquí?{' '}
            <Link href="/register">Crear Cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  )
}