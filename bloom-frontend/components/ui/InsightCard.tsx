import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius, spacing, shadow, type } from '../../constants/theme';


export function InsightCard({
  icon,
  value,
  label,
  tint = colors.pink,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
  tint?: string;
}) {
  return (
    <View style={[styles.wrap, shadow.card]}>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: tint + '2E' }]}>
          <Ionicons name={icon} size={16} color={tint} />
        </View>
        <Text style={[type.h3, { marginTop: spacing.sm }]} numberOfLines={1}>
          {value}
        </Text>
        <Text style={[type.caption, { marginTop: 2 }]} numberOfLines={1}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexBasis: '31%',
    flexGrow: 1,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  content: { padding: spacing.md, backgroundColor: colors.surface },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});