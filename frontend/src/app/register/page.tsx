'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'

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

  const field = (key: keyof typeof form, label: string, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
             style={{ color: 'var(--gray-500)' }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        className="input-base"
      />
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-62px)] flex items-center justify-center p-6"
         style={{ background: 'var(--gray-100)' }}>
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg border animate-fade-up"
           style={{ borderColor: 'var(--gray-200)' }}>

        <h1 className="font-display text-2xl font-bold text-center mb-6"
            style={{ color: 'var(--crimson-dark)' }}>
          Regístrate
        </h1>

        <div className="flex flex-col gap-4">
          {field('nombre',  'Nombre completo', 'text',     'Juan Pérez')}
          {field('correo',  'Correo electrónico', 'email', 'correo@ejemplo.com')}
          {field('password', 'Contraseña', 'password',    '••••••••')}
          {field('confirm',  'Confirmar contraseña', 'password', '••••••••')}

          {error && (
            <p className="text-sm text-center font-medium animate-fade-in" style={{ color: '#E74C3C' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full py-3 rounded-xl text-sm mt-1 disabled:opacity-60">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </div>

        <p className="text-center text-sm mt-5" style={{ color: 'var(--gray-500)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--crimson)' }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}