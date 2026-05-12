'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { useModal } from '@/components/Layout'
import '@/styles/Catalog.css'
import '@/styles/Layout.css'
import { productoService } from '@/services/productoService'
import type { Producto } from '@/types'

function ProductosContent() {
  const { openModal } = useModal()
  const searchParams  = useSearchParams()
  const router        = useRouter()
  
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading,   setLoading]   = useState(true)
  const [searchVal, setSearchVal] = useState('')

  const query  = searchParams.get('q') || searchParams.get('busqueda') || ''
  const cat    = searchParams.get('categoria') || ''
  const superm = searchParams.get('supermercado') || ''
  const offers = searchParams.get('ofertas') === 'true'

  useEffect(() => {
    setSearchVal(query)
    setLoading(true)
    productoService.getProductos({
      busqueda: query,
      categoria: cat,
      supermercado: superm,
      solo_ofertas: offers
    })
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [query, cat, superm, offers])

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (searchVal.trim()) params.set('q', searchVal.trim())
    else params.delete('q')
    router.push(`/productos?${params.toString()}`)
  }

  return (
    <div className="catalog-page">
      {/* ── Catalog Header ── */}
      <header className="catalog-header">
        <h1>Catálogo de Productos</h1>
      </header>

      {/* ── Filters Bar ── */}
      <div className="filters-bar">
        <div className="search-input-wrap">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
        </div>

        <div className="flex gap-2">
          <Link
            href="/productos"
            className={`super-badge ${!superm && !cat && !offers ? 'active' : ''}`}
            style={{ color: !superm && !cat && !offers ? 'var(--crimson)' : '#fff', background: !superm && !cat && !offers ? '#fff' : 'rgba(255,255,255,0.1)' }}
          >
            Todos
          </Link>
          <Link
            href={`/productos?ofertas=true`}
            className={`super-badge ${offers ? 'active' : ''}`}
            style={{ color: offers ? 'var(--crimson)' : '#fff', background: offers ? '#fff' : 'rgba(255,255,255,0.1)' }}
          >
            Ofertas
          </Link>
        </div>
      </div>

      <div className="section">
        {loading ? (
          <div className="products-grid">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : productos.length > 0 ? (
          <div className="products-grid">
            {productos.map((p, i) => (
              <div key={p.id_producto} className={`animate-fade-up stagger-${(i % 5) + 1}`}>
                <ProductCard producto={p} onAgregar={openModal} />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p className="icon">📦</p>
            <h3>Sin resultados</h3>
            <p>No encontramos productos con esos filtros.</p>
            <Link href="/productos" className="see-all mt-4 inline-block">Limpiar Filtros</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <ProductosContent />
    </Suspense>
  )
}