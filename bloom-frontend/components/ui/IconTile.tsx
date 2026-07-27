import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing, shadow, type } from '../../constants/theme';

export function IconTile({
  icon,
  label,
  caption,
  tint,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  caption?: string;
  tint: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, shadow.card, pressed && { opacity: 0.85 }]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: tint + '2E' }]}>
          <Ionicons name={icon} size={20} color={tint} />
        </View>
        <Text style={type.h3}>{label}</Text>
        {caption ? <Text style={[type.bodyMuted, { fontSize: 12 }]}>{caption}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flexBasis: '48%',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: { padding: spacing.md, gap: 6, backgroundColor: colors.surface },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});
