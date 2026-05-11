'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { Producto } from '@/types'

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
      className="card-hover bg-white rounded-[14px] border overflow-hidden cursor-pointer relative"
      style={{ borderColor: 'var(--gray-200)' }}
      onClick={() => setExpanded(!expanded)}
    >
      {producto.en_oferta && (
        <span className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--gold)' }}>
          OFERTA
        </span>
      )}

      <div className="absolute top-2 right-2 z-10 flex flex-col gap-0.5">
        {producto.precios && producto.precios.slice(0, 3).map((p) => (
          <div
            key={p.id_precio}
            title={p.supermercado || 'Supermercado'}
            className={`w-[22px] h-[22px] rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-white shadow-sm ${SUPER_COLORS[p.supermercado || ''] || 'badge-S'}`}
          >
            {p.supermercado ? SUPER_LETTERS[p.supermercado] || p.supermercado[0] : '?'}
          </div>
        ))}
      </div>

      <div className="w-full h-[130px] flex items-center justify-center" style={{ background: 'var(--gray-100)' }}>
        {producto.imagen_url ? (
          <Image src={producto.imagen_url} alt={producto.nombre} width={100} height={100} className="object-contain h-[100px] w-auto" />
        ) : (
          <span className="text-5xl select-none">🛒</span>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-semibold leading-snug mb-0.5" style={{ color: 'var(--gray-800)' }}>
          {producto.nombre}
        </p>
        <p className="text-xs mb-2" style={{ color: 'var(--gray-500)' }}>{producto.marca || 'General'}</p>

        <div className="flex items-baseline gap-1 mb-1">
          <span className="font-display text-base font-bold" style={{ color: 'var(--crimson)' }}>
            RD${precioDisplay.toFixed(2)}
          </span>
          {producto.en_oferta && (
            <span className="text-xs line-through" style={{ color: 'var(--gray-400)' }}>
              RD${minPrecio.toFixed(2)}
            </span>
          )}
        </div>
        <p className="text-[10px] mb-2" style={{ color: 'var(--gray-400)' }}>precio más bajo</p>

        {expanded && producto.precios && (
          <div className="rounded-lg p-2 mb-2 animate-fade-in" style={{ background: 'var(--crimson-soft)' }}>
            {producto.precios.map((p) => {
              const precio = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio
              const preciosList = producto.precios?.map(x => x.en_oferta && x.precio_oferta ? x.precio_oferta : x.precio) || []
              const isMin = precio === Math.min(...preciosList)
              return (
                <div key={p.id_precio} className="flex justify-between items-center py-0.5">
                  <span className="text-[11px]" style={{ color: 'var(--gray-700)' }}>
                    {p.supermercado || 'Desconocido'}
                    {p.en_oferta && <span className="ml-1 text-[9px] font-bold" style={{ color: 'var(--gold)' }}>•OFERTA</span>}
                  </span>
                  <span className={`text-[11px] font-semibold ${isMin ? 'font-bold' : ''}`} style={{ color: isMin ? 'var(--crimson)' : 'var(--gray-700)' }}>
                    RD${precio.toFixed(2)}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        <button
          onClick={(e) => { e.stopPropagation(); onAgregar?.(producto, precioDisplay) }}
          className="btn-primary w-full py-2 text-xs rounded-lg"
        >
          Agregar a lista
        </button>
      </div>
    </div>
  )
}