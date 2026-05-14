import api from './api'
import type { Lista } from '@/types'

export const listaService = {
  async getListas(): Promise<Lista[]> {
    const res = await api.get<Lista[]>('/listas')
    return res.data
  },

  async getLista(id: number): Promise<Lista> {
    const res = await api.get<Lista>(`/listas/${id}`)
    return res.data
  },

  async crearLista(nombre: string): Promise<Lista> {
    const res = await api.post<Lista>('/listas', { NOMBRE: nombre })
    return res.data
  },

  async renombrarLista(id: number, nombre: string): Promise<Lista> {
    const res = await api.put<Lista>(`/listas/${id}`, { NOMBRE: nombre })
    return res.data
  },

  async eliminarLista(id: number) {
    const res = await api.delete(`/listas/${id}`)
    return res.data
  },

  async agregarProducto(
    idLista: number,
    idProducto: number,
    cantidad: number,
    precioUnitario: number
  ): Promise<Lista> {
    const res = await api.post<Lista>(`/listas/${idLista}/agregar`, {
      ID_PRODUCTO: idProducto,
      CANTIDAD: cantidad,
      PRECIO_UNITARIO: precioUnitario,
    })
    return res.data
  },

  async actualizarCantidad(idDetalle: number, cantidad: number) {
    const res = await api.put(`/listas/detalle/${idDetalle}`, { CANTIDAD: cantidad })
    return res.data
  },

  async quitarProducto(idDetalle: number) {
    const res = await api.delete(`/listas/detalle/${idDetalle}`)
    return res.data
  },
}