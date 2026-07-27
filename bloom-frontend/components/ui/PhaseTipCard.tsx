import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing, type } from '../../constants/theme';

export function PhaseTipCard({ eyebrow, tip }: { eyebrow: string; tip: string }) {
  return (
    <View style={styles.wrap}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles-outline" size={18} color={colors.gold} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={type.caption}>{eyebrow}</Text>
          <Text style={[type.body, { marginTop: 2 }]}>{tip}</Text>
        </View>
      </View>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  message,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  message: string;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIconWrap}>
        <Ionicons name={icon} size={22} color={colors.pink} />
      </View>
      <Text style={[type.h3, { marginTop: spacing.sm }]}>{title}</Text>
      <Text style={[type.bodyMuted, { textAlign: 'center', marginTop: 4 }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(240,184,96,0.25)',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(240,184,96,0.08)',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg },
  emptyIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,111,160,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
