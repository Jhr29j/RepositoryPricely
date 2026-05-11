'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'

export default function Navbar() {
  const pathname       = usePathname()
  const router         = useRouter()
  const { user, logout } = useAuthStore()
  const [open, setOpen]  = useState(false)
  const dropRef          = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => {
    logout()
    setOpen(false)
    router.push('/')
  }

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href || pathname.startsWith(href + '/')
    return (
      <Link
        href={href}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
          isActive
            ? 'bg-white/25 border-white/40 text-white'
            : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20'
        }`}
      >
        {label}
      </Link>
    )
  }

  const nombre   = user?.nombre ?? ''
  const rol      = user?.rol ?? ''
  const initials = nombre
    ? nombre.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <nav
      className="sticky top-0 z-50 h-[62px] flex items-center justify-between px-6 md:px-10"
      style={{ background: 'var(--crimson)', boxShadow: '0 2px 20px rgba(0,0,0,0.25)' }}
    >
      <Link
        href="/"
        className="font-display text-2xl font-black text-white tracking-wide hover:opacity-90 transition-opacity"
      >
        PRICELY
      </Link>

      <div className="flex items-center gap-2">
        {navLink('/productos', 'Productos')}
        {navLink('/listas',   'Lista')}

        <div className="relative ml-1" ref={dropRef}>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={{
              background: 'rgba(255,255,255,0.92)',
              color:      'var(--crimson)',
              border:     '2px solid rgba(255,255,255,0.5)',
            }}
          >
            {initials}
          </button>

          {open && (
            <div
              className="absolute right-0 top-11 bg-white rounded-xl shadow-lg border overflow-hidden min-w-[160px] animate-fade-in"
              style={{ borderColor: 'var(--gray-200)' }}
            >
              {user ? (
                <>
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--gray-100)' }}>
                    <p className="text-xs font-semibold" style={{ color: 'var(--gray-800)' }}>{nombre}</p>
                    <p className="text-xs"               style={{ color: 'var(--gray-500)' }}>{rol}</p>
                  </div>

                  {(rol === 'Administrador' || rol === 'SuperAdmin') && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                      style={{ color: 'var(--gray-700)' }}
                    >
                      Panel Admin
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-red-50"
                    style={{ color: '#E74C3C' }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                    style={{ color: 'var(--gray-700)' }}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm hover:bg-red-50 transition-colors"
                    style={{ color: 'var(--gray-700)' }}
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}