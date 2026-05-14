'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Usuario {
  id_usuario: number
  nombre:     string
  correo:     string
  rol:        string
}

interface AuthState {
  user:    Usuario | null
  token:   string | null
  setAuth: (user: Usuario, token: string) => void
  logout:  () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:  null,
      token: null,

      setAuth: (user: Usuario, token: string) => set({ user, token }),

      logout: () => set({ user: null, token: null }),

      isAdmin: () => {
        const rol = get().user?.rol ?? ''
        return rol === 'Administrador' || rol === 'SuperAdmin'
      },
    }),
    {
      name: 'pricely-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)