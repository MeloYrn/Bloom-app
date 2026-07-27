import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../../constants/theme';

export function Chip({
  label,
  selected = false,
  onPress,
  icon,
  color = colors.purple,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
  color?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: colors.border },
      ]}
    >
      {icon}
      <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  label: { fontSize: 13, fontWeight: '600' },
});
