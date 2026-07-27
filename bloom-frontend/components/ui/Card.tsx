import React, { PropsWithChildren } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing, shadow, type } from '../../constants/theme';

/**
 * Glass card: BlurView (frosted blur of whatever gradient sits behind
 * it) + a thin translucent border + a soft dark shadow. This is what
 * gives cards depth against the gradient background instead of
 * flat-color boxes.
 */
export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return (
    <View style={[styles.wrap, shadow.card, style]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

export function ScreenHeader({
  title,
  subtitle,
  accentColor = colors.pink,
  right,
}: {
  title: string;
  subtitle?: string;
  accentColor?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={{ flex: 1 }}>
        <Text style={type.display}>{title}</Text>
        {subtitle ? <Text style={[type.bodyMuted, { marginTop: 2 }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: {
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  accentBar: {
    width: 4,
    height: 28,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
  },
});
