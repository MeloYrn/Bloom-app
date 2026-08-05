import { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Ionicons from '@expo/vector-icons/Ionicons';
import { notificationApi } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/auth.store';
import { Screen } from '../components/ui/Screen';
import { colors, spacing, radius, type } from '../constants/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const MIN_SPLASH_MS = 1400;

function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 480, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Screen>
      <View style={styles.splashCenter}>
        <Animated.View style={[styles.logoWrap, { opacity, transform: [{ scale }] }]}>
          <Ionicons name="flower-outline" size={44} color={colors.pink} />
        </Animated.View>
        <Animated.View style={{ opacity: textOpacity, alignItems: 'center' }}>
          <Text style={[type.display, { marginTop: spacing.lg }]}>Bloom</Text>
          <Text style={[type.bodyMuted, { marginTop: 4 }]}>Your cycle, understood</Text>
        </Animated.View>
      </View>
    </Screen>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { isLoggedIn, login } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_SPLASH_MS));
    Promise.all([checkLoginState(), minDelay]).then(() => setIsReady(true));

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
        await notificationApi.post(
          '/api/notifications/register-token',
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

  if (!isReady) return <SplashScreen />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  splashCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoWrap: {
    width: 92,
    height: 92,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,111,160,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});