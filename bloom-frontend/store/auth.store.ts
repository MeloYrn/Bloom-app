import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  token: string | null;
  userId: string | null;
  displayName: string | null;
  isLoggedIn: boolean;
  isHydrated: boolean;
  login: (token: string, userId: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userId: null,
  displayName: null,
  isLoggedIn: false,
  isHydrated: false,

  login: async (token, userId, displayName) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user_id', userId);
    set({ token, userId, displayName, isLoggedIn: true, isHydrated: true });
  },

  set({
    token: String(token),
    userId: String(userId),
    displayName: String(displayName),
    isLoggedIn: true,
  });
},
  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user_id');
    set({ token: null, userId: null, displayName: null, isLoggedIn: false, isHydrated: true });
  },

  hydrate: async () => {
    try {
      const [token, userId, displayName] = await Promise.all([
        SecureStore.getItemAsync('token'),
        SecureStore.getItemAsync('user_id'),
        SecureStore.getItemAsync('display_name'),
      ]);

      set({
        token,
        userId,
        displayName,
        isLoggedIn: Boolean(token && userId),
        isHydrated: true,
      });
    } catch (error) {
      console.log('Failed to hydrate auth state:', error);
      set({ isHydrated: true });
    }
  },
}));

void useAuthStore.getState().hydrate();