'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useModal } from '@/components/Layout'
import '@/styles/Hero.css'
import '@/styles/Layout.css'
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
      <section className="hero">
        <div className="max-w-4xl mx-auto">
          <h1>Compara precios en RD</h1>
          <p>
            Ahorra en cada compra comparando precios en los principales supermercados del país.
          </p>

          {/* Search bar */}
          <div className="hero-search">
            <input
              type="text"
              placeholder="¿Qué producto buscas hoy?"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
            />
            <button onClick={handleBuscar}>Buscar</button>
          </div>

          {/* Featured supermarkets */}
          <div className="super-badges">
            {SUPERMERCADOS.map((s) => (
              <Link key={s} href={`/productos?supermercado=${encodeURIComponent(s)}`} className="super-badge">
                {s}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Productos más listados ── */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Productos más Listados</h2>
          <Link href="/productos" className="see-all">Ver todos →</Link>
        </div>

        {loading ? (
          <div className="products-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-[14px]" />
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="products-grid">
            {productos.map((p, i) => (
              <div key={p.id_producto} className={`animate-fade-up stagger-${i + 1}`}>
                <ProductCard producto={p} onAgregar={openModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="icon">🛒</p>
            <p>No hay productos disponibles aún</p>
          </div>
        )}
      </section>

      {/* ── Ofertas ── */}
      {(loading || ofertas.length > 0) && (
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">Ofertas Destacadas</h2>
            <Link href="/productos?ofertas=true" className="see-all">Ver todas →</Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-64 rounded-[14px]" />)}
            </div>
          ) : (
            <div className="products-grid">
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
      <section className="features">
        <div className="features-grid">
          {[
            { icon: '💰', title: 'Compara Precios', desc: 'Encuentra el mejor precio en todos los supermercados' },
            { icon: '📋', title: 'Listas de Compra', desc: 'Crea y guarda tus listas para ahorrar tiempo' },
            { icon: '🏷️', title: 'Ofertas',          desc: 'Descubre los productos en oferta' },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer>
        <span className="footer-logo">PRICELY</span>
        © 2025 Pricely RD · pricely.02
      </footer>
    </div>
  )
}