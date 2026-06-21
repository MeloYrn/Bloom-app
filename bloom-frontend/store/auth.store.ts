import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  userId: string | null;
  displayName: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  displayName: null,
  isLoggedIn: false,

  login: async (token, userId, displayName) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user_id', userId);
    set({ token, userId, displayName, isLoggedIn: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user_id');
    set({ token: null, userId: null, displayName: null, isLoggedIn: false });
  },
}));