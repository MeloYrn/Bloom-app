import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const BASE_URL = 'http://172.20.10.3';

export const userApi = axios.create({ baseURL: `${BASE_URL}:8081` });
export const trackingApi = axios.create({ baseURL: `${BASE_URL}:8082` });
export const communityApi = axios.create({ baseURL: `${BASE_URL}:8083` });

// Automatically add the user's ID to every tracking request
trackingApi.interceptors.request.use(async (config) => {
  const userId = await SecureStore.getItemAsync('user_id');
  if (userId) {
    config.headers['X-User-Id'] = userId;
  }
  return config;
});