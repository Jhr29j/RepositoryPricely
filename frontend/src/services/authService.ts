import api from './api'
import type { LoginForm, RegisterForm, TokenResponse } from '@/types'

export const authService = {
  async login(data: LoginForm): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterForm): Promise<TokenResponse> {
    const res = await api.post<TokenResponse>('/auth/register', data)
    return res.data
  },

  async getProfile() {
    const res = await api.get('/auth/profile')
    return res.data
  },

  saveSession(token: string, user: object) {
    localStorage.setItem('pricely_token', token)
    localStorage.setItem('pricely_user', JSON.stringify(user))
  },

  clearSession() {
    localStorage.removeItem('pricely_token')
    localStorage.removeItem('pricely_user')
  },

  getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('pricely_token')
  },

  getUser() {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem('pricely_user')
    return raw ? JSON.parse(raw) : null
  },

  isLoggedIn(): boolean {
    return !!this.getToken()
  },
}