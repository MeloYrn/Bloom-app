import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/auth.store';

export default function AppIndex() {
  const { isHydrated, isLoggedIn } = useAuthStore();

  useEffect(() => {
    void useAuthStore.getState().hydrate();
  }, []);

  if (!isHydrated) {
    return null;
  }

  return isLoggedIn ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)/login" />;
}
