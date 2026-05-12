'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import '@/styles/Auth.css'

export default function RegisterPage() {
  const router      = useRouter()
  const { setAuth } = useAuthStore()
  const [form,    setForm]    = useState({ nombre: '', correo: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.nombre || !form.correo || !form.password || !form.confirm) {
      setError('Completa todos los campos'); return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden'); return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres'); return
    }
    setLoading(true)
    setError('')
    try {
      const res = await authService.register({
        nombre: form.nombre,
        correo: form.correo,
        password: form.password,
      })
      setAuth(res.usuario, res.access_token)
      authService.saveSession(res.access_token, res.usuario)
      router.push('/')
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-up">
        
        <div className="auth-header">
          <div className="auth-icon-wrap">✨</div>
          <h1 className="auth-title">Crear Cuenta</h1>
          <p className="auth-subtitle">Únete a la comunidad Pricely</p>
        </div>

        <div className="space-y-4">
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              placeholder="Juan Pérez"
              value={form.nombre}
              onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="form-input"
            />
          </div>

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

          <div className="grid grid-cols-2 gap-4">
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
            <div className="form-group">
              <label className="form-label">Confirmar</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={(e) => setForm(f => ({ ...f, confirm: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                className="form-input"
              />
            </div>
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
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </div>

        <div className="auth-footer">
          <p>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}