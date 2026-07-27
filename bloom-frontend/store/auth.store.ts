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
  await SecureStore.setItemAsync("token", String(token));
  await SecureStore.setItemAsync("user_id", String(userId));
  await SecureStore.setItemAsync("display_name", String(displayName));

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
    set({ token: null, userId: null, displayName: null, isLoggedIn: false });
  },
}));