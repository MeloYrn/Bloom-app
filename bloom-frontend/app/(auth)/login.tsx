import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/auth.store';
import { userApi } from '../../services/api';
import { KeyboardAvoidingView, Platform} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

 const handleLogin = async () => {
  if (!email || !password) {
    Alert.alert("Error", "Please fill in all fields");
    return;
  }

  setLoading(true);

  try {
    const response = await userApi.post("/api/auth/login", {
      email,
      password,
    });

    const { token, userId, displayName } = response.data;

    await login(token, userId, displayName);
    router.replace("/(tabs)");
    
  } catch (error: any) {
    console.log("STATUS:", error?.response?.status);
    console.log("DATA:", error?.response?.data);
    console.log("ERROR:", error?.message);

    Alert.alert(
      "Login Failed",
      JSON.stringify(error?.response?.data ?? error?.message)
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    > 
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌸</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue your health journey</Text>
      </View>
      
      
      <View style={styles.body}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#C2185B',
    padding: 28,
    paddingTop: 60,
  },
  logo: { fontSize: 36, marginBottom: 8 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#FCE4EC' },
  body: { flex: 1, padding: 24 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#777',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: '#F0E6EE',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    backgroundColor: '#FFF8F0',
  },
  button: {
    backgroundColor: '#C2185B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', color: '#C2185B', marginTop: 20, fontSize: 14, fontWeight: '600' },
});