'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { listaService } from '@/services/listaService'
import { useToast } from '@/components/Layout'
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

  if (loading) {
    return (
      <div>
        <div className="listas-header"><h1>MIS LISTAS</h1></div>
        <div className="listas-body">
          <div className="skeleton" style={{ height: 160, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 160, borderRadius: 14 }} />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="listas-header">
        <h1>MIS LISTAS</h1>
        <button className="btn-primary"
          style={{ padding: '0.5rem 1.2rem', borderRadius: 20, fontSize: '0.88rem' }}
          onClick={() => setCreating(!creating)}>
          + Nueva lista
        </button>
      </div>

      <div className="listas-body">

        {creating && (
          <div className="lista-card animate-fade-up" style={{ padding: '1.2rem' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.8rem', color: 'var(--gray-800)' }}>Nueva lista</p>
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Nombre de la lista..."
                value={newNombre}
                onChange={e => setNewNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCrear()}
                className="input-base"
                style={{ flex: 1 }}
                autoFocus
              />
              <button className="btn-primary" style={{ padding: '0 1.2rem', borderRadius: 8 }} onClick={handleCrear}>Crear</button>
              <button onClick={() => setCreating(false)}
                style={{ padding: '0 1rem', borderRadius: 8, border: '1px solid var(--gray-200)', background: '#fff', cursor: 'pointer', color: 'var(--gray-500)', fontFamily: 'DM Sans, sans-serif' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {listas.length === 0 && !creating && (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>Aún no tienes listas</h3>
            <p style={{ marginBottom: '1rem' }}>Crea tu primera lista de compra</p>
            <button className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: 8 }}
              onClick={() => setCreating(true)}>
              + Nueva lista
            </button>
          </div>
        )}

        {listas.map((lista, li) => {
          const items = lista.items ?? []
          const total = lista.total ?? 0

          return (
            <div key={lista.id_lista} className={`lista-card animate-fade-up stagger-${Math.min(li+1,5)}`}>
              <div className="lista-card-header">
                <span className="lista-name">📋 {lista.nombre}</span>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span style={{ background: 'var(--crimson)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '2px 10px', borderRadius: 20 }}>
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                  <button onClick={() => handleEliminar(lista.id_lista, lista.nombre)}
                    style={{ border: '1px solid #E74C3C', color: '#E74C3C', background: 'none', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                    Eliminar
                  </button>
                </div>
              </div>

              {items.length > 0 ? (
                <div className="lista-products">
                  {items.map(item => (
                    <div key={item.id_detalle} className="lista-product-card">
                      <button className="lista-remove" onClick={() => handleQuitarProducto(item.id_detalle, lista.id_lista)}>✕</button>
                      <div className="lista-product-img">🛒</div>
                      <p className="lista-product-name">{item.nombre_producto}</p>
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => handleCantidad(item.id_detalle, lista.id_lista, item.cantidad - 1)}>−</button>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, flex: 1, textAlign: 'center' }}>{item.cantidad}</span>
                        <button className="qty-btn" onClick={() => handleCantidad(item.id_detalle, lista.id_lista, item.cantidad + 1)}>+</button>
                      </div>
                      <p className="lista-product-price">RD${item.subtotal.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--gray-400)', fontSize: '0.85rem' }}>
                  Lista vacía · agrega productos desde el catálogo
                </p>
              )}

              <div className="lista-total">
                Total estimado: RD${total.toFixed(2)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}