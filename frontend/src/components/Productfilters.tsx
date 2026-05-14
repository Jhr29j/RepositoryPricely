'use client'
import { useState, useEffect } from 'react'
import type { Categoria, Supermercado, ProductosFiltros } from '@/types'
import { productoService } from '@/services/productoService'

interface Props {
  onChange: (filtros: ProductosFiltros) => void
}

export default function ProductFilters({ onChange }: Props) {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [supermercados, setSupermercados] = useState<Supermercado[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [supermercado, setSupermercado] = useState('')
  const [soloOfertas, setSoloOfertas] = useState(false)

  useEffect(() => {
    productoService.getCategorias().then(setCategorias).catch(() => {})
    productoService.getSupermercados().then(setSupermercados).catch(() => {})
  }, [])

  useEffect(() => {
    onChange({ busqueda, categoria, supermercado, solo_ofertas: soloOfertas })
  }, [busqueda, categoria, supermercado, soloOfertas, onChange])

  return (
    <div className="flex flex-wrap gap-3 items-center px-6 md:px-10 py-4" style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
      <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 border flex-1 min-w-[200px]" style={{ borderColor: 'var(--gray-200)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border-none outline-none text-sm flex-1 bg-transparent"
          style={{ color: 'var(--gray-800)' }}
        />
      </div>

      <select
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="border rounded-full px-4 py-2 text-sm outline-none bg-white"
        style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-700)' }}
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id_categoria} value={c.nombre}>{c.nombre}</option>
        ))}
      </select>

      <select
        value={supermercado}
        onChange={(e) => setSupermercado(e.target.value)}
        className="border rounded-full px-4 py-2 text-sm outline-none bg-white"
        style={{ borderColor: 'var(--gray-200)', color: 'var(--gray-700)' }}
      >
        <option value="">Todos los supermercados</option>
        {supermercados.map((s) => (
          <option key={s.id_supermercado} value={s.nombre}>{s.nombre}</option>
        ))}
      </select>

      <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--gray-700)' }}>
        <input
          type="checkbox"
          checked={soloOfertas}
          onChange={(e) => setSoloOfertas(e.target.checked)}
          className="accent-crimson w-4 h-4"
          style={{ accentColor: 'var(--crimson)' }}
        />
        Solo ofertas
      </label>
    </div>
  )
}