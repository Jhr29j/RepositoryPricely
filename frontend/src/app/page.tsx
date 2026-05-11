'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useModal } from '@/components/Layout'
import { productoService } from '@/services/productoService'
import type { Producto } from '@/types'

const SUPERMERCADOS = ['La Sirena', 'El Nacional', 'Jumbo', 'Bravo', 'Olé']

export default function HomePage() {
  const { openModal }  = useModal()
  const [productos, setProductos]   = useState<Producto[]>([])
  const [ofertas,   setOfertas]     = useState<Producto[]>([])
  const [loading,   setLoading]     = useState(true)
  const [busqueda,  setBusqueda]    = useState('')
  const router = typeof window !== 'undefined' ? null : null

  useEffect(() => {
    Promise.all([
      productoService.getProductos(),
      productoService.getProductos({ solo_ofertas: true }),
    ])
      .then(([all, ofs]) => {
        setProductos(all.slice(0, 4))
        setOfertas(ofs.slice(0, 4))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleBuscar = () => {
    if (busqueda.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(busqueda)}`
    }
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden text-center py-20 px-6"
        style={{
          background: 'linear-gradient(135deg, var(--crimson-dark) 0%, var(--crimson) 60%, var(--crimson-light) 100%)',
        }}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
          }} />

        <div className="relative">
          <h1 className="font-display text-white font-black mb-3 animate-fade-up"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 3.8rem)' }}>
            Compara precios en RD
          </h1>
          <p className="text-white/85 text-lg mb-8 animate-fade-up stagger-1">
            Encuentra los mejores precios en supermercados de Santo Domingo
          </p>

          {/* Search */}
          <div className="flex max-w-lg mx-auto bg-white rounded-full overflow-hidden shadow-2xl animate-fade-up stagger-2">
            <input
              type="text"
              placeholder="¿Qué producto buscas?"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
              className="flex-1 px-5 py-3.5 text-sm outline-none border-none"
              style={{ color: 'var(--gray-800)' }}
            />
            <button onClick={handleBuscar} className="btn-primary px-6 py-3.5 rounded-none text-sm">
              Buscar
            </button>
          </div>

          {/* Supermercado badges */}
          <div className="flex gap-2 justify-center mt-6 flex-wrap animate-fade-up stagger-3">
            {SUPERMERCADOS.map((s) => (
              <Link key={s} href={`/productos?supermercado=${encodeURIComponent(s)}`}
                className="px-3 py-1 rounded-full text-white/90 text-xs font-medium border border-white/25 hover:bg-white/20 transition-all"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos más listados ── */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--crimson-dark)' }}>
            Productos más Listados
          </h2>
          <Link href="/productos" className="text-sm font-medium hover:underline" style={{ color: 'var(--crimson)' }}>
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-[14px]" />
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {productos.map((p, i) => (
              <div key={p.id_producto} className={`animate-fade-up stagger-${i + 1}`}>
                <ProductCard producto={p} onAgregar={openModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl" style={{ background: 'var(--gray-100)' }}>
            <p className="text-4xl mb-2">🛒</p>
            <p style={{ color: 'var(--gray-500)' }}>No hay productos disponibles aún</p>
          </div>
        )}
      </section>

      {/* ── Ofertas ── */}
      {(loading || ofertas.length > 0) && (
        <section className="max-w-6xl mx-auto px-6 md:px-10 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--crimson-dark)' }}>
              Ofertas Destacadas
            </h2>
            <Link href="/productos?ofertas=true" className="text-sm font-medium hover:underline" style={{ color: 'var(--crimson)' }}>
              Ver todas →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 rounded-[14px]" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ofertas.map((p, i) => (
                <div key={p.id_producto} className={`animate-fade-up stagger-${i + 1}`}>
                  <ProductCard producto={p} onAgregar={openModal} />
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Features ── */}
      <section className="py-12 px-6" style={{ background: 'var(--crimson-soft)' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '💰', title: 'Compara Precios', desc: 'Encuentra el mejor precio en todos los supermercados' },
            { icon: '📋', title: 'Listas de Compra', desc: 'Crea y guarda tus listas para ahorrar tiempo' },
            { icon: '🏷️', title: 'Ofertas',          desc: 'Descubre los productos en oferta' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-card border"
                 style={{ borderColor: 'var(--gray-200)' }}>
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--gray-800)' }}>{f.title}</h3>
              <p className="text-sm" style={{ color: 'var(--gray-500)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-sm" style={{ background: 'var(--crimson-dark)', color: 'rgba(255,255,255,0.6)' }}>
        <span className="font-display text-white font-bold text-base block mb-1">PRICELY</span>
        © 2025 Pricely RD · pricely.02
      </footer>
    </div>
  )
}