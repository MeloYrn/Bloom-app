import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, radius, shadow, type } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const isDisabled = disabled || loading;
  const content = loading ? (
    <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? colors.text : '#FFFFFF'} />
  ) : (
    <Text style={[styles.label, { color: variant === 'secondary' || variant === 'ghost' ? colors.text : '#FFFFFF' }]}>
      {label}
    </Text>
  );

  if (variant === 'primary' || variant === 'danger') {
    const gradientColors: [string, string] =
      variant === 'danger' ? [colors.danger, '#C23B57'] : [colors.gradientStart, colors.gradientEnd];
    return (
      <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [isDisabled && styles.disabled, pressed && !isDisabled && { opacity: 0.88 }, style]}>
        <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.base, shadow.glow]}>
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'secondary' ? styles.secondary : styles.ghost,
        isDisabled && styles.disabled,
        pressed && !isDisabled && { opacity: 0.85 },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  secondary: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: colors.border },
  ghost: { backgroundColor: 'transparent' },
  label: { fontSize: type.h3.fontSize, fontWeight: '700' },
  disabled: { opacity: 0.5 },
});
