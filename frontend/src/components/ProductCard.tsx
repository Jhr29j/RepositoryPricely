'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { Producto } from '@/types'
import '@/styles/ProductCard.css'

const SUPER_COLORS: Record<string, string> = {
  'La Sirena':   'badge-S',
  'El Nacional': 'badge-N',
  'Jumbo':       'badge-J',
  'Bravo':       'badge-B',
  'Olé':         'badge-O',
}
const SUPER_LETTERS: Record<string, string> = {
  'La Sirena':   'S',
  'El Nacional': 'N',
  'Jumbo':       'J',
  'Bravo':       'B',
  'Olé':         'O',
}

interface Props {
  producto: Producto
  onAgregar?: (producto: Producto, precio: number) => void
}

export default function ProductCard({ producto, onAgregar }: Props) {
  const [expanded, setExpanded] = useState(false)
  const minPrecio = producto.precio_minimo || 0
  const precioDisplay = producto.en_oferta && producto.precios?.[0]?.precio_oferta 
    ? producto.precios[0].precio_oferta 
    : minPrecio

  if (!producto) return null;

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-card transition-all duration-300 relative flex flex-col h-full"
      style={{ boxShadow: 'var(--shadow)' }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Badge de Oferta */}
      {producto.en_oferta && (
        <span className="absolute top-3 left-3 z-10 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider" style={{ background: 'var(--gold)' }}>
          Oferta
        </span>
      )}

      {/* Badges de Supermercados */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {producto.precios && producto.precios.slice(0, 3).map((p) => (
          <div
            key={p.id_precio}
            title={p.supermercado || 'Supermercado'}
            className={`w-[24px] h-[24px] rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm transition-transform group-hover:scale-110 ${SUPER_COLORS[p.supermercado || ''] || 'badge-S'}`}
          >
            {p.supermercado ? SUPER_LETTERS[p.supermercado] || p.supermercado[0] : '?'}
          </div>
        ))}
      </div>

      {/* Imagen */}
      <div className="w-full aspect-square flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
        {producto.imagen_url ? (
          <Image src={producto.imagen_url} alt={producto.nombre} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <span className="text-6xl select-none opacity-20">🛒</span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] uppercase font-bold tracking-widest mb-1" style={{ color: 'var(--gray-400)' }}>
          {producto.marca || 'General'}
        </p>
        <h3 className="text-sm font-bold leading-tight mb-3 line-clamp-2 min-h-[2.5rem]" style={{ color: 'var(--gray-800)' }}>
          {producto.nombre}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-xl font-black" style={{ color: 'var(--crimson)' }}>
              RD${precioDisplay.toFixed(2)}
            </span>
            {producto.en_oferta && (
              <span className="text-xs line-through opacity-40 font-medium">
                RD${minPrecio.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-tight mb-4" style={{ color: 'var(--gray-400)' }}>
            Precio más bajo
          </p>

          {/* Lista de precios ampliada */}
          {expanded && producto.precios && (
            <div className="rounded-xl p-3 mb-4 space-y-1 animate-fade-in bg-crimson-soft/50 border border-crimson-soft">
              {producto.precios.map((p) => {
                const precio = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio
                const preciosList = producto.precios?.map(x => x.en_oferta && x.precio_oferta ? x.precio_oferta : x.precio) || []
                const isMin = precio === Math.min(...preciosList)
                return (
                  <div key={p.id_precio} className="flex justify-between items-center text-[12px]">
                    <span className="font-medium" style={{ color: 'var(--gray-600)' }}>
                      {p.supermercado}
                    </span>
                    <span className={`font-bold ${isMin ? 'text-crimson' : 'text-gray-800'}`}>
                      RD${precio.toFixed(2)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          <button
            onClick={(e) => { e.stopPropagation(); onAgregar?.(producto, precioDisplay) }}
            className="w-full bg-crimson hover:bg-crimson-dark text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-md active:scale-95"
          >
            Agregar a lista
          </button>
        </div>
      </div>
    </div>
  )
}