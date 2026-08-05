import React from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import { colors, spacing, radius, type } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/auth.store';

const MENU: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; onPress: () => void }[] = [
  {
    icon: 'lock-closed-outline',
    label: 'Privacy',
    onPress: () => Alert.alert(
      'Your privacy at Bloom',
      'Your cycle and health information is kept private in your account. We use it only to provide your Bloom experience and do not sell your personal health data. Community posts can be shared anonymously.'
    ),
  },
  {
    icon: 'help-circle-outline',
    label: 'Help & support',
    onPress: () => Alert.alert(
      'Contact Bloom support',
      'Need a hand or want to report an issue? Contact us at support@bloom.app and we will get back to you as soon as we can.'
    ),
  },
  {
    icon: 'information-circle-outline',
    label: 'About Bloom',
    onPress: () => Alert.alert(
      'About Bloom',
      `Bloom is a women's health and wellness companion built by Group 39 at KNUST CodeQuest 2026. It helps you understand and track your menstrual cycle.\n\nVersion ${Constants.expoConfig?.version ?? '1.0.0'}`
    ),
  },
];

export default function Profile() {
  const { displayName, logout } = useAuthStore();

  const confirmLogout = () => {
    Alert.alert('Log out?', 'Are you sure you want to log out of Bloom?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: () => void logout() },
    ]);
  };

  const getInitials = (name?: string | null) => {
    const safeName = (name ?? '').trim();
    if (!safeName) return '?';
    const parts = safeName.split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ width: 22 }} />
          <Text style={type.h1}>Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
          </View>
          <Text style={[type.h2, { marginTop: spacing.sm }]}>{displayName || 'Your Profile'}</Text>
        </View>

        <Card style={{ padding: 0 }}>
          {MENU.map((item, i) => (
              <View key={item.label} style={i === MENU.length - 1 ? undefined : styles.rowBorder}>
                <Pressable style={styles.menuRow} onPress={item.onPress}>
                  <Ionicons name={item.icon} size={18} color={colors.textMuted} />
                  <Text style={[type.body, { flex: 1 }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
                </Pressable>
              </View>
          ))}
        </Card>

        <Pressable style={styles.logout} onPress={confirmLogout}>
          <Ionicons name="log-out-outline" size={18} color={colors.danger} />
          <Text style={[type.body, { color: colors.danger, fontWeight: '600' }]}>Log out</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.lg },
  avatarBlock: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
  },
});
