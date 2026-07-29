import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';
import { userApi } from '../../services/api';
import { colors, spacing, radius, type } from '../../constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await userApi.post('/api/auth/login', { email, password });
      const { token, userId, displayName } = response.data;

      await login(token, userId, displayName);
      router.replace('/(tabs)');
    } catch (error: any) {
      console.log('STATUS:', error?.response?.status);
      console.log('DATA:', error?.response?.data);
      console.log('ERROR:', error?.message);

      Alert.alert('Login Failed', JSON.stringify(error?.response?.data ?? error?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="flower-outline" size={30} color={colors.pink} />
          </View>
          <Text style={[type.display, { marginTop: spacing.md }]}>Welcome back</Text>
          <Text style={[type.bodyMuted, { marginTop: 4 }]}>Sign in to continue your health journey</Text>
        </View>

        <View style={styles.body}>
          <Text style={[type.label, styles.fieldLabel]}>EMAIL ADDRESS</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color={colors.textFaint} />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor={colors.textFaint}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={[type.label, styles.fieldLabel]}>PASSWORD</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textFaint} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textFaint}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textFaint} />
            </TouchableOpacity>
          </View>

          <Button
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ marginTop: spacing.xl }}
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.link}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, alignItems: 'flex-start' },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,111,160,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  fieldLabel: { marginTop: spacing.md, marginBottom: spacing.sm },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    height: 50,
  },
  input: { flex: 1, fontSize: 15, color: colors.text },
  link: { textAlign: 'center', color: colors.pink, marginTop: spacing.lg, fontSize: 14, fontWeight: '600' },
});