import { create } from 'zustand';
import { AuthResponse } from '../types';

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
    localStorage.setItem('access_token', response.access);
    set({ user: response.user, token: response.access });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    set({ user: null, token: null });
  },
}));
