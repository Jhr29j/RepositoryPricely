'use client'
<<<<<<< HEAD

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

  const searchParams = useSearchParams()
  const router = useRouter()

  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const [searchVal, setSearchVal] = useState('')

  /* ── DROPDOWN FILTERS ── */
  const [showFilters, setShowFilters] = useState(false)

  /* ── SELECTED FILTERS ── */
  const [selectedSupers, setSelectedSupers] = useState<string[]>([])
  const [selectedCategoria, setSelectedCategoria] = useState('')

  /* ── Query Params ── */
  const query = searchParams.get('q') || searchParams.get('busqueda') || ''

  const cat = searchParams.get('categoria') || ''

  const superm = searchParams.get('supermercado') || ''

  const offers = searchParams.get('ofertas') === 'true'

  /* ── Data ── */
  const categorias = [
    'Enlatados',
    'Bebidas',
    'Limpieza del Hogar',
    'Snacks y dulces',
    'Cereales',
    'Lacteos',
    'Bebes',
    'Panaderia',
    'Higiene personal'
  ]

  const supermercados = [
    'Olé',
    'JUMBO',
    'Bravo',
    'La sirena',
    'El nacional'
  ]

  /* ── Fetch ── */
  useEffect(() => {

    setSearchVal(query)

    if (superm) {
      setSelectedSupers(superm.split(','))
    }

    if (cat) {
      setSelectedCategoria(cat)
    }

    setLoading(true)

=======
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
>>>>>>> 16f9a44557d6a86548e826da06e654ecf651cd3e
    productoService.getProductos({
      busqueda: query,
      categoria: cat,
      supermercado: superm,
      solo_ofertas: offers
    })
      .then(data => setProductos(data))
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
<<<<<<< HEAD

  }, [query, cat, superm, offers])

  /* ── Search ── */
  const handleSearch = () => {

    const params = new URLSearchParams(searchParams.toString())

    if (searchVal.trim()) {
      params.set('q', searchVal.trim())
    } else {
      params.delete('q')
    }

    router.push(`/productos?${params.toString()}`)
  }

  /* ── Select Supermarkets (max 2) ── */
  const toggleSupermercado = (supermercado: string) => {

    let updated = [...selectedSupers]

    if (updated.includes(supermercado)) {

      updated = updated.filter(s => s !== supermercado)

    } else {

      if (updated.length >= 2) return

      updated.push(supermercado)
    }

    setSelectedSupers(updated)
  }

  /* ── Apply Filters ── */
  const applyFilters = () => {

    const params = new URLSearchParams()

    if (searchVal.trim()) {
      params.set('q', searchVal.trim())
    }

    if (selectedCategoria) {
      params.set('categoria', selectedCategoria)
    }

    if (selectedSupers.length > 0) {
      params.set('supermercado', selectedSupers.join(','))
    }

    router.push(`/productos?${params.toString()}`)

    setShowFilters(false)
  }

  /* ── Reset Filters ── */
  const resetFilters = () => {

    setSelectedSupers([])

    setSelectedCategoria('')

    router.push('/productos')
  }

  return (

    <div className="catalog-page">

      {/* ───────────────── HEADER ───────────────── */}
      <header className="catalog-header">

        <h1>
          Catálogo de Productos
        </h1>

      </header>

      {/* ───────────────── FILTERS ───────────────── */}
      <div className="filters-bar">

        {/* SEARCH + BUTTON */}
        <div className="search-row">

          {/* SEARCH */}
          <div className="search-input-wrap">

            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />

            <button onClick={handleSearch}>
              🔍
            </button>

          </div>

          {/* FILTER BUTTON */}
          <button
            className="filters-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >

             Filtros

          </button>

        </div>

        {/* ───────────────── DROPDOWN ───────────────── */}
        {showFilters && (

          <div className="filters-dropdown">

            {/* SUPERMARKETS */}
            <div>

              <h3 className="filter-group-title">
                Selecciona hasta 2 supermercados
              </h3>

              <div className="supermarket-grid">

                {supermercados.map((supermercado) => (

                  <button
                    key={supermercado}
                    onClick={() => toggleSupermercado(supermercado)}
                    className={`supermarket-option ${
                      selectedSupers.includes(supermercado)
                        ? 'active'
                        : ''
                    }`}
                  >

                    {supermercado}

                  </button>

                ))}

              </div>

            </div>

            {/* CATEGORY */}
            <div>

              <h3 className="filter-group-title">
                Categoría
              </h3>

              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="category-select"
              >

                <option value="">
                  Todas las categorías
                </option>

                {categorias.map((categoria) => (

                  <option
                    key={categoria}
                    value={categoria}
                  >

                    {categoria}

                  </option>

                ))}

              </select>

            </div>

            {/* ACTIONS */}
            <div className="filters-actions">

              <button
                className="filter-action-btn reset"
                onClick={resetFilters}
              >

                Limpiar

              </button>

              <button
                className="filter-action-btn apply"
                onClick={applyFilters}
              >

                Aplicar filtros

              </button>

            </div>

          </div>

        )}

      </div>

      {/* ───────────────── PRODUCTS ───────────────── */}
      <div className="section">

        {loading ? (

          <div className="products-grid">

            {[...Array(10)].map((_, i) => (

              <div
                key={i}
                className="skeleton h-64 rounded-2xl"
              />

            ))}

          </div>

        ) : productos.length > 0 ? (

          <div className="products-grid">

            {productos.map((p, i) => (

              <div
                key={p.id_producto}
                className={`animate-fade-up stagger-${(i % 5) + 1}`}
              >

                <ProductCard
                  producto={p}
                  onAgregar={openModal}
                />

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-state">

            <p className="icon">
              📦
            </p>

            <h3>
              Sin resultados
            </h3>

            <p>
              No encontramos productos con esos filtros.
            </p>

            <Link
              href="/productos"
              className="see-all mt-4 inline-block"
            >

              Limpiar filtros

            </Link>

          </div>

        )}

      </div>

=======
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
>>>>>>> 16f9a44557d6a86548e826da06e654ecf651cd3e
    </div>
  )
}

export default function ProductosPage() {
<<<<<<< HEAD

  return (

    <Suspense
      fallback={
        <div className="p-10 text-center">
          Cargando...
        </div>
      }
    >

      <ProductosContent />

    </Suspense>

=======
  return (
    <Suspense fallback={<div className="p-10 text-center">Cargando...</div>}>
      <ProductosContent />
    </Suspense>
>>>>>>> 16f9a44557d6a86548e826da06e654ecf651cd3e
  )
}