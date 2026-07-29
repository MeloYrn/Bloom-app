import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card } from './Card';
import { Button } from './Button';
import { MoodFace } from './MoodFace';
import { colors, spacing, radius, type } from '../../constants/theme';

/**
 * Home-screen "how are you feeling today" prompt. Swaps to a done
 * state once today's entry exists, so it never asks twice in one day.
 */
export function DailyCheckIn({
  loggedToday,
  mood,
  onSelectMood,
  onSubmit,
  submitting,
}: {
  loggedToday: boolean;
  mood: 0 | 1 | 2 | 3 | 4 | null;
  onSelectMood: (level: 0 | 1 | 2 | 3 | 4) => void;
  onSubmit: () => void;
  submitting: boolean;
}) {
  if (loggedToday) {
    return (
      <Card>
        <View style={styles.doneRow}>
          <View style={styles.doneIcon}>
            <Ionicons name="checkmark" size={16} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.h3}>You checked in today</Text>
            <Text style={[type.bodyMuted, { marginTop: 2 }]}>
              Nice — come back tomorrow to keep your streak going.
            </Text>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <Text style={type.h3}>How are you feeling today?</Text>
      <View style={styles.moodRow}>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <Pressable
            key={level}
            onPress={() => onSelectMood(level)}
            style={[styles.mood, level === mood && styles.moodSelected]}
          >
            <MoodFace level={level} selected={level === mood} size={30} />
          </Pressable>
        ))}
      </View>
      <Button
        label={submitting ? 'Saving…' : 'Log check-in'}
        onPress={onSubmit}
        disabled={mood === null || submitting}
        style={{ marginTop: spacing.md }}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  mood: { padding: spacing.xs, borderRadius: radius.pill },
  moodSelected: { backgroundColor: 'rgba(255,255,255,0.1)' },
  doneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  doneIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(52,211,153,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});