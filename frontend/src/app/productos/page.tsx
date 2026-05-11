'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { useModal } from '@/components/Layout'
import { productoService } from '@/services/productoService'
import type { Producto } from '@/types'

function ProductosContent() {
  const { openModal } = useModal()
  const searchParams = useSearchParams()
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  const query = searchParams.get('q') || searchParams.get('busqueda') || ''
  const cat = searchParams.get('categoria') || ''
  const superm = searchParams.get('supermercado') || ''
  const offers = searchParams.get('ofertas') === 'true'

  useEffect(() => {
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

  return (
    <div className="max-w-6xl mx-auto px-6 md:px-10 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold mb-2" style={{ color: 'var(--crimson-dark)' }}>
          {query ? `Resultados para "${query}"` : 'Todos los Productos'}
        </h1>
        {superm && <span className="text-sm bg-gray-100 px-3 py-1 rounded-full mr-2">Súper: {superm}</span>}
        {offers && <span className="text-sm bg-gold/10 text-gold-dark px-3 py-1 rounded-full border border-gold/20">Solo Ofertas</span>}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-64 rounded-[14px]" />
          ))}
        </div>
      ) : productos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productos.map((p, i) => (
            <div key={p.id_producto} className={`animate-fade-up stagger-${(i % 4) + 1}`}>
              <ProductCard producto={p} onAgregar={openModal} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold mb-1">No encontramos lo que buscas</h3>
          <p className="text-gray-500">Intenta con otros términos o filtros</p>
        </div>
      )}
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