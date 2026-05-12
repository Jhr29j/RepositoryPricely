'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { listaService } from '@/services/listaService'
import { useToast } from '@/components/Layout'
import '@/styles/Listas.css'
import '@/styles/Layout.css'
import type { Lista } from '@/types'

export default function ListasPage() {
  const { user }      = useAuthStore()
  const router        = useRouter()
  const { showToast } = useToast()
  const [listas,    setListas]    = useState<Lista[]>([])
  const [loading,   setLoading]   = useState(true)
  const [newNombre, setNewNombre] = useState('')
  const [creating,  setCreating]  = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    listaService.getListas()
      .then((data) => setListas(data.map(l => ({ ...l, items: l.items ?? [], total: l.total ?? 0 }))))
      .catch(() => showToast('Error cargando listas', 'err'))
      .finally(() => setLoading(false))
  }, [user])

  const handleCrear = async () => {
    if (!newNombre.trim()) return
    try {
      const nueva = await listaService.crearLista(newNombre.trim())
      setListas(prev => [...prev, { ...nueva, items: nueva.items ?? [], total: nueva.total ?? 0 }])
      setNewNombre('')
      setCreating(false)
      showToast(`Lista "${nueva.nombre}" creada`)
    } catch { showToast('Error al crear lista', 'err') }
  }

  const handleEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar la lista "${nombre}"?`)) return
    try {
      await listaService.eliminarLista(id)
      setListas(prev => prev.filter(l => l.id_lista !== id))
      showToast(`Lista "${nombre}" eliminada`)
    } catch { showToast('Error al eliminar', 'err') }
  }

  const handleQuitarProducto = async (idDetalle: number, idLista: number) => {
    try {
      await listaService.quitarProducto(idDetalle)
      const updated = await listaService.getLista(idLista)
      setListas(prev => prev.map(l => l.id_lista === idLista
        ? { ...updated, items: updated.items ?? [], total: updated.total ?? 0 }
        : l))
      showToast('Producto eliminado')
    } catch { showToast('Error al eliminar', 'err') }
  }

  const handleCantidad = async (idDetalle: number, idLista: number, cantidad: number) => {
    if (cantidad < 1) return
    try {
      await listaService.actualizarCantidad(idDetalle, cantidad)
      const updated = await listaService.getLista(idLista)
      setListas(prev => prev.map(l => l.id_lista === idLista
        ? { ...updated, items: updated.items ?? [], total: updated.total ?? 0 }
        : l))
    } catch { showToast('Error al actualizar', 'err') }
  }

  return (
    <div className="listas-page bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <header className="listas-header">
        <h1>Mis Listas</h1>
        <button onClick={() => setCreating(!creating)} className="btn-primary px-8">
          + Nueva Lista
        </button>
      </header>

      <div className="listas-body">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton h-80 rounded-3xl" />
            <div className="skeleton h-80 rounded-3xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {creating && (
              <div className="bg-white rounded-3xl border-2 border-dashed border-crimson/30 p-8 flex flex-col items-center justify-center animate-fade-up">
                <p className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--crimson)' }}>Crear Nueva Lista</p>
                <input
                  type="text"
                  placeholder="Ej: Compras del mes..."
                  value={newNombre}
                  onChange={e => setNewNombre(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCrear()}
                  className="input-base max-w-xs mb-4 text-center"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={handleCrear} className="btn-primary px-6 py-2 rounded-lg text-xs">Crear</button>
                  <button onClick={() => setCreating(false)} className="px-6 py-2 rounded-lg text-xs border border-gray-200 font-bold hover:bg-gray-50 uppercase tracking-widest text-gray-400">Cancelar</button>
                </div>
              </div>
            )}

            {listas.length === 0 && !creating && (
              <div className="empty-state col-span-full">
                <p className="icon">📋</p>
                <h3>No tienes listas aún</h3>
                <p>Crea tu primera lista para empezar a ahorrar.</p>
              </div>
            )}

            {listas.map((lista, li) => {
              const items = lista.items ?? []
              return (
                <div key={lista.id_lista} className="lista-card animate-fade-up" style={{ animationDelay: `${li * 0.1}s` }}>
                  <div className="lista-card-header">
                    <h3 className="lista-name">{lista.nombre}</h3>
                    <div className="flex items-center gap-2">
                      <span className="bg-crimson-soft text-crimson text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                        {items.length} PRD
                      </span>
                      <button onClick={() => handleEliminar(lista.id_lista, lista.nombre)} className="lista-remove">
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-6">
                    {items.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {items.map(item => (
                          <div key={item.id_detalle} className="lista-product-card group">
                            <button className="lista-remove opacity-0 group-hover:opacity-100" onClick={() => handleQuitarProducto(item.id_detalle, lista.id_lista)}>✕</button>
                            <div className="lista-product-img">🍎</div>
                            <p className="lista-product-name truncate">{item.nombre_producto}</p>
                            
                            <div className="qty-controls justify-center">
                              <button onClick={() => handleCantidad(item.id_detalle, lista.id_lista, item.cantidad - 1)} className="qty-btn">-</button>
                              <span className="text-[11px] font-black w-4">{item.cantidad}</span>
                              <button onClick={() => handleCantidad(item.id_detalle, lista.id_lista, item.cantidad + 1)} className="qty-btn">+</button>
                            </div>
                            <p className="lista-product-price">RD${item.subtotal.toFixed(0)}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state py-12">
                        <p className="icon" style={{ fontSize: '2rem' }}>🧊</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-300">Lista Vacía</p>
                      </div>
                    )}
                  </div>

                  <div className="lista-total">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Estimado</span>
                      <span className="text-lg font-black text-crimson">RD${(lista.total || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}