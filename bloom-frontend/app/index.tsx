// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // TODO: swap this for your real auth check (e.g. from your store/JWT)
  const isLoggedIn = false;

  return isLoggedIn
    ? <Redirect href="/(tabs)/track" />
    : <Redirect href="/(auth)/login" />;
}