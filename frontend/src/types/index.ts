export interface Usuario {
  id_usuario: number
  nombre:     string
  correo:     string
  rol:        string
}

export interface TokenResponse {
  access_token: string
  token_type:   string
  usuario:      Usuario
}

export interface LoginForm {
  correo:   string
  password: string
}

export interface RegisterForm {
  nombre:   string
  correo:   string
  password: string
}

export interface PrecioOut {
  id_precio:           number
  supermercado:        string
  imagen_supermercado: string | null
  precio:              number
  en_oferta:           boolean
  precio_oferta:       number | null
}

export interface Producto {
  id_producto:   number
  nombre:        string
  imagen_url:    string | null
  marca:         string
  imagen_marca:  string | null
  categoria:     string
  en_oferta:     boolean
  precio_minimo: number
  precios:       PrecioOut[]
}

export interface Marca {
  id_marca:   number
  nombre:     string
  imagen_url: string | null
}

export interface Categoria {
  id_categoria: number
  nombre:       string
}

export interface Supermercado {
  id_supermercado: number
  nombre:          string
  direccion:       string | null
  imagen_url:      string | null
}

export interface DetalleOut {
  id_detalle:      number
  id_producto:     number
  nombre_producto: string
  imagen_producto: string | null
  cantidad:        number
  precio_unitario: number
  subtotal:        number
}

export interface Lista {
  id_lista:       number
  nombre:         string
  fecha_creacion: string
  items:          DetalleOut[]   // nunca undefined
  total:          number         // nunca undefined
}

export interface ProductosFiltros {
  busqueda?:     string
  categoria?:    string
  supermercado?: string
  marca?:        string
  solo_ofertas?: boolean
}