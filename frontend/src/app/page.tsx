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
  const { openModal } = useModal()

  const [productos, setProductos] = useState<Producto[]>([])
  const [ofertas, setOfertas] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productoService.getProductos(),
      productoService.getProductos({ solo_ofertas: true }),
    ])
      .then(([all, ofs]) => {
        setProductos(all.slice(0, 4))
        setOfertas(ofs.slice(0, 4))
      })
      .catch(() => {
        // 🔥 MOCK DATA SI FALLA LA API
        const mockProductos: Producto[] = [
          {
            id_producto: 1,
            nombre: 'Arroz 5lb',
            precio: 250,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'La Sirena',
          },
          {
            id_producto: 2,
            nombre: 'Leche Entera',
            precio: 80,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'Jumbo',
          },
          {
            id_producto: 3,
            nombre: 'Aceite Vegetal',
            precio: 300,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'Bravo',
          },
          {
            id_producto: 4,
            nombre: 'Huevos (12)',
            precio: 180,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'Olé',
          },
        ]

        const mockOfertas: Producto[] = [
          {
            id_producto: 5,
            nombre: 'Pollo entero',
            precio: 150,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'El Nacional',
          },
          {
            id_producto: 6,
            nombre: 'Pan de molde',
            precio: 60,
            imagen: 'https://via.placeholder.com/300',
            supermercado: 'Jumbo',
          },
        ]

        setProductos(mockProductos)
        setOfertas(mockOfertas)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-glow" />
        <div className="hero-bg-glow secondary" />

        <div className="max-w-6xl mx-auto hero-content">
          <div className="hero-badge animate-fade-up">
            🇩🇴 La plataforma #1 para comparar precios en supermercados
          </div>

          <h1 className="hero-title animate-fade-up stagger-1">
            Compra inteligente.
            <span>Ahorra más en cada visita al súper.</span>
          </h1>

          <p className="hero-description animate-fade-up stagger-2">
            Compara precios entre <strong>La Sirena</strong>,
            <strong> Jumbo</strong>, <strong>Bravo</strong>,
            <strong> Olé</strong> y <strong>El Nacional</strong> en una sola
            plataforma moderna, rápida y diseñada para República Dominicana.
          </p>

          <div className="hero-actions animate-fade-up stagger-3">
            <Link href="/productos" className="hero-btn primary">
              Explorar Productos
            </Link>

            <Link
              href="/productos?ofertas=true"
              className="hero-btn secondary"
            >
              Ver Ofertas
            </Link>
          </div>

          <div className="hero-stats animate-fade-up stagger-4">
            <div className="hero-stat-card">
              <h3>+10K</h3>
              <p>Productos comparados</p>
            </div>

            <div className="hero-stat-card">
              <h3>5</h3>
              <p>Supermercados conectados</p>
            </div>

            <div className="hero-stat-card">
              <h3>24/7</h3>
              <p>Actualización de precios</p>
            </div>
          </div>

          <div className="super-badges animate-fade-up stagger-5">
            {SUPERMERCADOS.map((s) => (
              <Link
                key={s}
                href={`/productos?supermercado=${encodeURIComponent(s)}`}
                className="super-badge"
              >
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

          <Link href="/productos" className="see-all">
            Ver todos →
          </Link>
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
              <div
                key={p.id_producto}
                className={`animate-fade-up stagger-${i + 1}`}
              >
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

            <Link href="/productos?ofertas=true" className="see-all">
              Ver todas →
            </Link>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-64 rounded-[14px]" />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {ofertas.map((p, i) => (
                <div
                  key={p.id_producto}
                  className={`animate-fade-up stagger-${i + 1}`}
                >
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
            {
              icon: '💰',
              title: 'Compara Precios',
              desc: 'Encuentra el mejor precio en todos los supermercados',
            },
            {
              icon: '📋',
              title: 'Listas de Compra',
              desc: 'Crea y guarda tus listas para ahorrar tiempo',
            },
            {
              icon: '🏷️',
              title: 'Ofertas',
              desc: 'Descubre los productos en oferta',
            },
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