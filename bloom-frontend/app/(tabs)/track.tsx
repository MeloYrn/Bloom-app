import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { Calendar } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Screen } from '../../components/ui/Screen';
import { Card, ScreenHeader } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { MoodFace } from '../../components/ui/MoodFace';
import { colors, spacing, radius, type, phaseMeta } from '../../constants/theme';
import { trackingApi } from '../../services/api';

const FLOW_OPTIONS = [
  { label: 'Light', value: 'light' },
  { label: 'Medium', value: 'medium' },
  { label: 'Heavy', value: 'heavy' },
  { label: 'Spotting', value: 'spotting' },
];

const SYMPTOM_OPTIONS = [
  { key: 'cramps', label: 'Cramps' },
  { key: 'fatigue', label: 'Fatigue' },
  { key: 'headache', label: 'Headache' },
  { key: 'bloating', label: 'Bloating' },
  { key: 'moodSwings', label: 'Mood Swings' },
  { key: 'hotFlashes', label: 'Hot Flashes' },
];

export default function TrackScreen() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [flow, setFlow] = useState('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState<0 | 1 | 2 | 3 | 4>(2);
  const [saving, setSaving] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [symptomHistory, setSymptomHistory] = useState<any[]>([]);
  const [predictedNext, setPredictedNext] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyRes = await trackingApi.get('/api/cycles/history');
      const predictRes = await trackingApi.get('/api/cycles/predict');

      const marks: any = {};

      historyRes.data.forEach((log: any) => {
        marks[log.startDate] = { selected: true, selectedColor: phaseMeta.period.color };
      });

      if (predictRes.data.fertileWindowStart && predictRes.data.fertileWindowEnd) {
        let current = new Date(predictRes.data.fertileWindowStart);
        const end = new Date(predictRes.data.fertileWindowEnd);
        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0];
          if (!marks[dateStr]) {
            marks[dateStr] = { selected: true, selectedColor: phaseMeta.fertile.color };
          }
          current.setDate(current.getDate() + 1);
        }
      }

      if (predictRes.data.fertileWindowEnd) {
        marks[predictRes.data.fertileWindowEnd] = { selected: true, selectedColor: phaseMeta.ovulation.color };
      }

      if (predictRes.data.nextPeriod) {
        marks[predictRes.data.nextPeriod] = { selected: true, selectedColor: phaseMeta.predicted.color };
        setPredictedNext(predictRes.data.nextPeriod);
      }

      setMarkedDates(marks);

      try {
        const symptomsRes = await trackingApi.get('/api/symptoms/history');
        setSymptomHistory(symptomsRes.data);
      } catch (err) {
        console.log('Failed to load symptom history:', err);
      }
    } catch (err) {
      console.log('Failed to load history:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  };

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const saveCycle = async () => {
    setSaving(true);
    try {
      await trackingApi.post('/api/cycles/log', {
        startDate: startDate.toISOString().split('T')[0],
        flowLevel: flow,
      });

      if (selectedSymptoms.length > 0) {
        await trackingApi.post('/api/symptoms/log', {
          date: startDate.toISOString().split('T')[0],
          symptoms: selectedSymptoms,
          mood,
        });
      }

      setSelectedSymptoms([]);
      await loadHistory();
    } catch (err) {
      console.log('Failed to save cycle:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />}
      >
        <ScreenHeader title="Period Tracker" subtitle="Track your cycle and patterns" accentColor={colors.pink} />

        <View style={styles.section}>
          <Card>
            <Calendar
              markedDates={markedDates}
              theme={{
                calendarBackground: 'transparent',
                dayTextColor: colors.text,
                monthTextColor: colors.text,
                textDisabledColor: colors.textFaint,
                selectedDayBackgroundColor: colors.pink,
                todayTextColor: colors.pink,
                arrowColor: colors.pink,
              }}
              style={{ backgroundColor: 'transparent' }}
            />
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: phaseMeta.period.color }]} />
                <Text style={type.caption}>Period</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: phaseMeta.fertile.color }]} />
                <Text style={type.caption}>Fertile</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: phaseMeta.predicted.color }]} />
                <Text style={type.caption}>Predicted</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, { backgroundColor: phaseMeta.ovulation.color }]} />
                <Text style={type.caption}>Ovulation</Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Text style={type.h2}>Log today's period</Text>

            <Text style={[type.label, styles.fieldLabel]}>DATE</Text>
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(_event: any, date?: Date) => {
                if (date) setStartDate(date);
              }}
            />

            <Text style={[type.label, styles.fieldLabel]}>FLOW LEVEL</Text>
            <View style={styles.chipRow}>
              {FLOW_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  label={opt.label}
                  selected={flow === opt.value}
                  color={colors.pink}
                  onPress={() => setFlow(opt.value)}
                />
              ))}
            </View>

            <Text style={[type.label, styles.fieldLabel]}>SYMPTOMS</Text>
            <View style={styles.chipRow}>
              {SYMPTOM_OPTIONS.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={selectedSymptoms.includes(s.key)}
                  color={colors.purple}
                  onPress={() => toggleSymptom(s.key)}
                />
              ))}
            </View>

            <Text style={[type.label, styles.fieldLabel]}>MOOD TODAY</Text>
            <View style={styles.moodRow}>
              {([0, 1, 2, 3, 4] as const).map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setMood(level)}
                  style={[styles.mood, level === mood && styles.moodSelected]}
                >
                  <MoodFace level={level} selected={level === mood} size={28} />
                </Pressable>
              ))}
            </View>

            <Button label={saving ? 'Saving…' : "Save today's log"} onPress={saveCycle} disabled={saving} style={{ marginTop: spacing.lg }} />
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingTop: spacing.sm, paddingLeft: spacing.xs },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  fieldLabel: { marginTop: spacing.md, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.sm },
  mood: { padding: spacing.xs, borderRadius: radius.pill },
  moodSelected: { backgroundColor: 'rgba(255,255,255,0.1)' },
});
