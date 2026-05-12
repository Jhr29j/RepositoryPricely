'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import '@/styles/Navbar.css'

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
        className={`px-5 py-1.5 rounded-md text-[13px] font-semibold tracking-wide transition-all uppercase ${
          isActive
            ? 'bg-white text-crimson-dark'
            : 'text-white hover:bg-white/10'
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
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        PRICELY
      </Link>

      <div className="navbar-links">
        <div className="hidden md:flex gap-2">
          <Link href="/productos" className={`nav-btn ${pathname === '/productos' ? 'active' : ''}`}>
            Productos
          </Link>
          <Link href="/listas" className={`nav-btn ${pathname === '/listas' ? 'active' : ''}`}>
            Mis Listas
          </Link>
        </div>

        <div className={`nav-avatar ${open ? 'open' : ''}`} ref={dropRef} onClick={() => setOpen(!open)}>
          {initials}

          <div className="nav-dropdown" onClick={(e) => e.stopPropagation()}>
            {user ? (
              <>
                <div className="nav-dropdown-header">
                  <p className="nav-user-name">{nombre}</p>
                  <p className="nav-user-rol">{rol}</p>
                </div>
                <Link href="/listas" onClick={() => setOpen(false)}>Mis Listas</Link>
                {(rol === 'Administrador' || rol === 'SuperAdmin') && (
                  <Link href="/admin" onClick={() => setOpen(false)}>Administración</Link>
                )}
                <div className="sep" />
                <button onClick={handleLogout} className="danger">Cerrar sesión</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)}>Iniciar sesión</Link>
                <Link href="/register" onClick={() => setOpen(false)}>Registrarse</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}