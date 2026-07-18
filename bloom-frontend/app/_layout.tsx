import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { notificationApi } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/auth.store';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { isLoggedIn, login } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkLoginState();
    registerForPushNotifications();

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification tapped:', response);
    });

    return () => subscription.remove();
  }, []);

  const checkLoginState = async () => {
    const token = await SecureStore.getItemAsync('token');
    const userId = await SecureStore.getItemAsync('user_id');

    if (token && userId) {
      await login(token, userId, '');
    }
    setIsReady(true);
  };

  const registerForPushNotifications = async () => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission not granted');
      return;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      console.log('Push token:', token);

      const userId = await SecureStore.getItemAsync('user_id');
      if (userId) {
        await notificationApi.post('/api/notifications/register-token', 
          { token },
          { headers: { 'X-User-Id': userId } }
        );
        console.log('Token registered with backend');
      }
    } catch (error) {
      console.log('Error getting push token:', error);
    }
  };

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments, isReady]);

  if (!isReady) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}