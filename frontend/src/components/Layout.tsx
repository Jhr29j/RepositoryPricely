'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import type { Producto, Lista } from '@/types'
import { listaService } from '@/services/listaService'
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'next/navigation'
import '@/styles/Layout.css'

// ── Toast Context ──────────────────────────────────────────────────────────
interface ToastCtx { showToast: (msg: string, type?: 'ok' | 'err') => void }
export const ToastContext = createContext<ToastCtx>({ showToast: () => {} })
export const useToast = () => useContext(ToastContext)

// ── Modal Context ──────────────────────────────────────────────────────────
interface ModalCtx { openModal: (producto: Producto, precio: number) => void }
export const ModalContext = createContext<ModalCtx>({ openModal: () => {} })
export const useModal = () => useContext(ModalContext)

// ── Provider ───────────────────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const router   = useRouter()

  // Toast
  const [toast,    setToast]    = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const showToast = useCallback((msg: string, type: 'ok' | 'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2800)
  }, [])

  // Modal
  const [modalOpen,    setModalOpen]    = useState(false)
  const [modalProduct, setModalProduct] = useState<Producto | null>(null)
  const [modalPrecio,  setModalPrecio]  = useState(0)
  const [qty,          setQty]          = useState(1)
  const [listas,       setListas]       = useState<Lista[]>([])
  const [selectedList, setSelectedList] = useState<number | null>(null)
  const [loadingListas, setLoadingListas] = useState(false)
  const [newListName,  setNewListName]  = useState('')
  const [creatingNew,  setCreatingNew]  = useState(false)

  const openModal = useCallback((producto: Producto, precio: number) => {
    if (!user) { router.push('/login'); return }
    setModalProduct(producto)
    setModalPrecio(precio)
    setQty(1)
    setSelectedList(null)
    setNewListName('')
    setCreatingNew(false)
    setModalOpen(true)
    setLoadingListas(true)
    listaService.getListas()
      .then((ls) => { setListas(ls); if (ls.length) setSelectedList(ls[0].id_lista) })
      .catch(() => setListas([]))
      .finally(() => setLoadingListas(false))
  }, [user, router])

  const handleCrearYAgregar = async () => {
    if (!newListName.trim() || !modalProduct) return
    try {
      const nueva = await listaService.crearLista(newListName.trim())
      await listaService.agregarProducto(nueva.id_lista, modalProduct.id_producto, qty, modalPrecio)
      showToast(`✓ Agregado a "${nueva.nombre}"`)
      setModalOpen(false)
    } catch { showToast('Error al agregar', 'err') }
  }

  const handleAgregar = async () => {
    if (!modalProduct) return
    if (creatingNew) { handleCrearYAgregar(); return }
    if (!selectedList) { showToast('Selecciona una lista', 'err'); return }
    try {
      const lista = listas.find(l => l.id_lista === selectedList)
      await listaService.agregarProducto(selectedList, modalProduct.id_producto, qty, modalPrecio)
      showToast(`✓ Agregado a "${lista?.nombre}"`)
      setModalOpen(false)
    } catch { showToast('Error al agregar', 'err') }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ModalContext.Provider value={{ openModal }}>
        {children}

        {/* ── MODAL ── */}
        {modalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
               style={{ background: 'rgba(0,0,0,0.5)' }}
               onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-up">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-lg font-bold" style={{ color: 'var(--crimson-dark)' }}>
                  Agregar a lista
                </h3>
                <button onClick={() => setModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none">✕</button>
              </div>

              <p className="text-sm mb-4" style={{ color: 'var(--gray-500)' }}>
                {modalProduct?.nombre} · <strong style={{ color: 'var(--crimson)' }}>RD${modalPrecio.toFixed(2)}</strong>
              </p>

              {/* Cantidad */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>Cantidad:</span>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-lg transition-all hover:border-crimson"
                  style={{ borderColor: 'var(--gray-200)' }}>−</button>
                <span className="text-base font-bold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-lg transition-all hover:border-crimson"
                  style={{ borderColor: 'var(--gray-200)' }}>+</button>
              </div>

              {/* Listas */}
              <div className="flex flex-col gap-2 mb-4 max-h-48 overflow-y-auto">
                {loadingListas ? (
                  <div className="skeleton h-10 rounded-lg" />
                ) : (
                  <>
                    {listas.map((l) => (
                      <button key={l.id_lista}
                        onClick={() => { setSelectedList(l.id_lista); setCreatingNew(false) }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${
                          selectedList === l.id_lista && !creatingNew
                            ? 'border-crimson bg-crimson-soft font-semibold'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          borderColor: selectedList === l.id_lista && !creatingNew ? 'var(--crimson)' : 'var(--gray-200)',
                          background:  selectedList === l.id_lista && !creatingNew ? 'var(--crimson-soft)' : '',
                          color:       selectedList === l.id_lista && !creatingNew ? 'var(--crimson-dark)' : 'var(--gray-700)',
                        }}>
                        📋 {l.nombre}
                      </button>
                    ))}
                    <button
                      onClick={() => { setCreatingNew(true); setSelectedList(null) }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all text-left ${creatingNew ? 'border-crimson bg-crimson-soft' : 'border-dashed border-gray-300 hover:border-gray-400'}`}
                      style={{
                        borderColor: creatingNew ? 'var(--crimson)' : undefined,
                        background:  creatingNew ? 'var(--crimson-soft)' : undefined,
                        color:       creatingNew ? 'var(--crimson-dark)' : 'var(--gray-500)',
                      }}>
                      ＋ Nueva lista
                    </button>
                    {creatingNew && (
                      <input
                        type="text"
                        placeholder="Nombre de la lista..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="input-base mt-1"
                        autoFocus
                      />
                    )}
                  </>
                )}
              </div>

              <button onClick={handleAgregar} className="btn-primary w-full py-2.5 rounded-xl text-sm">
                Agregar a lista
              </button>
            </div>
          </div>
        )}

        {/* ── TOAST ── */}
        {toast && (
          <div
            className="fixed bottom-6 right-6 z-[300] px-5 py-3 rounded-xl text-white text-sm font-medium shadow-lg animate-fade-up"
            style={{ background: toast.type === 'err' ? '#C0392B' : 'var(--crimson-dark)' }}>
            {toast.msg}
          </div>
        )}
      </ModalContext.Provider>
    </ToastContext.Provider>
  )
}