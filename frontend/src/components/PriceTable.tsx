import type { PrecioOut } from '@/types'

interface Props {
  precios: PrecioOut[]
}

const SUPER_COLORS: Record<string, string> = {
  'La Sirena':   '#F4C430',
  'El Nacional': '#1A5276',
  'Jumbo':       '#1E8449',
  'Bravo':       '#C0392B',
  'Olé':         '#E67E22',
}

export default function PriceTable({ precios }: Props) {
  if (!precios || precios.length === 0) {
    return <div className="text-center py-8 text-gray-500">No hay precios disponibles</div>;
  }

  const sorted = [...precios].sort((a, b) => {
    const pa = a.en_oferta && a.precio_oferta ? a.precio_oferta : a.precio
    const pb = b.en_oferta && b.precio_oferta ? b.precio_oferta : b.precio
    return pa - pb
  })
  
  const minPrecio = sorted[0] ? (sorted[0].en_oferta && sorted[0].precio_oferta ? sorted[0].precio_oferta : sorted[0].precio) : 0

  return (
    <div className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--gray-200)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'var(--crimson)', color: '#fff' }}>
            <th className="text-left px-4 py-3 font-semibold">Supermercado</th>
            <th className="text-right px-4 py-3 font-semibold">Precio</th>
            <th className="text-center px-4 py-3 font-semibold">Oferta</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => {
            const precio = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio
            const isMin = precio === minPrecio
            const color = p.supermercado ? (SUPER_COLORS[p.supermercado] || 'var(--crimson)') : 'var(--crimson)'
            return (
              <tr key={p.id_precio} style={{ background: i % 2 === 0 ? '#fff' : 'var(--gray-50)' }}>
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  {p.supermercado || 'Desconocido'}
                  {isMin && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: 'var(--crimson)' }}>
                      MÁS BAJO
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-bold" style={{ color: isMin ? 'var(--crimson)' : 'var(--gray-800)' }}>
                  RD${precio.toFixed(2)}
                  {p.en_oferta && (
                    <span className="ml-1 text-xs line-through" style={{ color: 'var(--gray-400)' }}>
                      RD${p.precio.toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.en_oferta && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--gold)' }}>
                      OFERTA
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}