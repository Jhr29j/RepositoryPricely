import api from './api'
import type { Producto, Marca, Categoria, Supermercado, PrecioOut, ProductosFiltros } from '@/types'

export const productoService = {
  async getProductos(filtros?: ProductosFiltros): Promise<Producto[]> {
    const params = new URLSearchParams()
    if (filtros?.busqueda)     params.set('busqueda', filtros.busqueda)
    if (filtros?.categoria)    params.set('categoria', filtros.categoria)
    if (filtros?.supermercado) params.set('supermercado', filtros.supermercado)
    if (filtros?.marca)        params.set('marca', filtros.marca)
    if (filtros?.solo_ofertas) params.set('solo_ofertas', 'true')
    const res = await api.get<Producto[]>(`/productos?${params.toString()}`)
    return res.data
  },

  async getProducto(id: number): Promise<Producto> {
    const res = await api.get<Producto>(`/productos/${id}`)
    return res.data
  },

  async getMarcas(): Promise<Marca[]> {
    const res = await api.get<Marca[]>('/marcas')
    return res.data
  },

  async getCategorias(): Promise<Categoria[]> {
    const res = await api.get<Categoria[]>('/categorias')
    return res.data
  },

  async getSupermercados(): Promise<Supermercado[]> {
    const res = await api.get<Supermercado[]>('/supermercados')
    return res.data
  },

  async getPrecios(idProducto: number): Promise<PrecioOut[]> {
    const res = await api.get<PrecioOut[]>(`/precios/producto/${idProducto}`)
    return res.data
  },

  // Admin
  async createProducto(data: FormData) {
    const res = await api.post('/productos', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  },

  async updateProducto(id: number, data: Partial<Producto>) {
    const res = await api.put(`/productos/${id}`, data)
    return res.data
  },

  async deleteProducto(id: number) {
    const res = await api.delete(`/productos/${id}`)
    return res.data
  },

  async updatePrecio(idPrecio: number, precio: number) {
    const res = await api.put(`/precios/${idPrecio}`, { PRECIO: precio })
    return res.data
  },
}