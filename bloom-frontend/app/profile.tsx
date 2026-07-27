import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, radius, type } from '../constants/theme';
import { Screen } from '../components/ui/Screen';
import { Card } from '../components/ui/Card';

const MENU: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string }[] = [
  { icon: 'person-outline', label: 'Edit profile' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'lock-closed-outline', label: 'Privacy' },
  { icon: 'help-circle-outline', label: 'Help & support' },
];

export default function Profile() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={type.h1}>Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SA</Text>
          </View>
          {/* TODO: bind to real user name/email from your auth store */}
          <Text style={[type.h2, { marginTop: spacing.sm }]}>Serwaa Ampaafo</Text>
        </View>

        <Card style={{ padding: 0 }}>
          {MENU.map((item, i) => (
            <Pressable key={item.label} style={[styles.menuRow, i === MENU.length - 1 && { borderBottomWidth: 0 }]}>
              <Ionicons name={item.icon} size={18} color={colors.textMuted} />
              <Text style={[type.body, { flex: 1 }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textFaint} />
            </Pressable>
          ))}
        </Card>

        <Pressable style={styles.logout} onPress={() => {/* TODO: call your sign-out action */}}>
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
  avatar: { width: 72, height: 72, borderRadius: radius.pill, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.md, paddingHorizontal: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginTop: spacing.xl, paddingVertical: spacing.md },
});
