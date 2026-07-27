import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '../store/auth.store';

const BASE_URL = 'http://172.20.10.5';

const getCurrentUserId = async () => {
  const storeUserId = useAuthStore.getState().userId;
  if (storeUserId) {
    return storeUserId;
  }

  const storedUserId = await SecureStore.getItemAsync('user_id');
  if (storedUserId) {
    useAuthStore.setState({ userId: storedUserId });
    return storedUserId;
  }

  return null;
};

export const userApi = axios.create({ baseURL: `${BASE_URL}:8081` });
export const trackingApi = axios.create({ baseURL: `${BASE_URL}:8082` });
export const communityApi = axios.create({ baseURL: `${BASE_URL}:8083` });
export const notificationApi = axios.create({ baseURL:`${BASE_URL}:8084` });

// Automatically add the user's ID to every tracking request
trackingApi.interceptors.request.use(async (config) => {
  const userId = await getCurrentUserId();
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});