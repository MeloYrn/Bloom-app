import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors, spacing, radius, type, phaseMeta } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader, Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { MoodFace } from '../../components/ui/MoodFace';

const FLOW_LEVELS = ['None', 'Light', 'Medium', 'Heavy'];
const SYMPTOMS = ['Cramps', 'Fatigue', 'Headache', 'Bloating', 'Mood swings', 'Hot flashes'];
const MOOD_LEVELS = [0, 1, 2, 3, 4] as const;

// TODO: replace with real marked dates computed from the user's logged cycles.
const markedDates: Record<string, any> = {
  '2026-06-25': { color: colors.period, textColor: '#fff' },
  '2026-06-26': { color: colors.period, textColor: '#fff' },
  '2026-06-27': { color: colors.predicted, textColor: colors.text },
  '2026-06-14': { color: colors.fertile, textColor: '#fff' },
  '2026-06-15': { color: colors.fertile, textColor: '#fff' },
};

export default function Track() {
  const [flow, setFlow] = useState('Light');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState(2);

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Track" subtitle="Your cycle and patterns" accentColor={colors.pink} />

        <View style={styles.section}>
          <Card style={{ padding: spacing.sm }}>
            <Calendar
              current="2026-06-29"
              markingType="period"
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: colors.textMuted,
                selectedDayBackgroundColor: colors.pink,
                todayTextColor: colors.pink,
                dayTextColor: colors.text,
                textDisabledColor: colors.textFaint,
                arrowColor: colors.pink,
                monthTextColor: colors.text,
                textMonthFontWeight: '700',
                textDayFontWeight: '500',
                textDayHeaderFontWeight: '600',
              }}
            />
            <View style={styles.legendRow}>
              {(['period', 'fertile', 'predicted'] as const).map((key) => (
                <View key={key} style={styles.legendItem}>
                  <View style={[styles.dot, { backgroundColor: phaseMeta[key].color }]} />
                  <Text style={type.bodyMuted}>{phaseMeta[key].label}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Text style={type.h2}>Log today's period</Text>

            <Text style={[type.label, styles.fieldLabel]}>FLOW LEVEL</Text>
            <View style={styles.chipRow}>
              {FLOW_LEVELS.map((f) => (
                <Chip key={f} label={f} selected={flow === f} color={colors.pink} onPress={() => setFlow(f)} />
              ))}
            </View>

            <Text style={[type.label, styles.fieldLabel]}>SYMPTOMS</Text>
            <View style={styles.chipRow}>
              {SYMPTOMS.map((s) => (
                <Chip key={s} label={s} selected={symptoms.includes(s)} color={colors.purple} onPress={() => toggleSymptom(s)} />
              ))}
            </View>

            <Text style={[type.label, styles.fieldLabel]}>MOOD TODAY</Text>
            <View style={styles.moodRow}>
              {MOOD_LEVELS.map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setMood(level)}
                  style={[styles.mood, level === mood && styles.moodSelected]}
                >
                  <MoodFace level={level} selected={level === mood} size={28} />
                </Pressable>
              ))}
            </View>

            <Button label="Save today's log" onPress={() => {}} style={{ marginTop: spacing.lg }} />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  legendRow: { flexDirection: 'row', gap: spacing.md, paddingTop: spacing.sm, paddingLeft: spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  fieldLabel: { marginTop: spacing.md, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.sm },
  mood: { padding: spacing.xs, borderRadius: radius.pill },
  moodSelected: { backgroundColor: 'rgba(255,255,255,0.1)' },
});
