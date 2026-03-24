import { create } from 'zustand';
import type { AuthResponse } from '../types';

interface AuthStore {
  user: AuthResponse['user'] | null;
  token: string | null;
  setAuth: (response: AuthResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setAuth: (response) => {
    if (response.access) localStorage.setItem('access_token', response.access);
    if (response.refresh) localStorage.setItem('refresh_token', response.refresh);
    if (response.user) localStorage.setItem('user', JSON.stringify(response.user));
    set({ user: response.user || null, token: response.access || null });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
