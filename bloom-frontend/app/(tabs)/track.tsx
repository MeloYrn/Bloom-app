import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { trackingApi } from '../../services/api';
import {RefreshControl } from 'react-native';


const FLOW_OPTIONS = [
  { label: 'Light', value: 'light', color: '#FFCDD2' },
  { label: 'Medium', value: 'medium', color: '#EF9A9A' },
  { label: 'Heavy', value: 'heavy', color: '#E57373' },
  { label: 'Spotting', value: 'spotting', color: '#FFCCBC' },
];

const SYMPTOM_OPTIONS = [
  { key: 'cramps', label: 'Cramps', emoji: '😣' },
  { key: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { key: 'headache', label: 'Headache', emoji: '🤕' },
  { key: 'bloating', label: 'Bloating', emoji: '😟' },
  { key: 'moodSwings', label: 'Mood Swings', emoji: '😠' },
  { key: 'hotFlashes', label: 'Hot Flashes', emoji: '🔥' },
];

const MOOD_OPTIONS = ['😢', '😕', '😐', '🙂', '😄'];

export default function TrackScreen() {
  const [startDate, setStartDate] = useState(new Date());
  const [flow, setFlow] = useState('medium');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [mood, setMood] = useState(2);
  const [saving, setSaving] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [ovulationDay, setOvulationDay] = useState<string | null>(null);
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
        marks[log.startDate] = {
          selected: true,
          selectedColor: '#C2185B',

          
        };
      });

      if (predictRes.data.fertileWindowStart && predictRes.data.fertileWindowEnd) {
        let current = new Date(predictRes.data.fertileWindowStart);
        const end = new Date(predictRes.data.fertileWindowEnd);
        while (current <= end) {
          const dateStr = current.toISOString().split('T')[0];
          if (!marks[dateStr]) {
            marks[dateStr] = { selected: true, selectedColor: '#A5D6A7' };
          }
          current.setDate(current.getDate() + 1);
        }
      }

      if (predictRes.data.fertileWindowEnd) {
        setOvulationDay(predictRes.data.fertileWindowEnd);
        marks[predictRes.data.fertileWindowEnd] = { selected: true, selectedColor: '#CE93D8' };
      }

      if (predictRes.data.nextPeriod) {
        marks[predictRes.data.nextPeriod] = {
          selected: true,
          selectedColor: '#F8BBD0',
        };
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

  const toggleSymptom = (s: string) =>
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#C2185B" />
    }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Period Tracker</Text>
        <Text style={styles.headerSub}>Track your cycle and patterns</Text>
      </View>

      <View style={styles.body}>
        {/* Calendar */}
        <View style={styles.calendarCard}>
          <Calendar
            markedDates={markedDates}
            theme={{
              selectedDayBackgroundColor: '#C2185B',
              todayTextColor: '#C2185B',
              arrowColor: '#C2185B',
            }}
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#C2185B' }]} />
              <Text style={styles.legendText}>Period</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#A5D6A7' }]} />
              <Text style={styles.legendText}>Fertile</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#F8BBD0' }]} />
              <Text style={styles.legendText}>Predicted</Text>
            </View>
            <View style={styles.legendItem}>
             <View style={[styles.legendDot, { backgroundColor: '#CE93D8' }]} />
             <Text style={styles.legendText}>Ovulation</Text>
            </View>
          </Card>
        </View>

        <View style={styles.section}>
          <Card>
            <Text style={type.h2}>Log today's period</Text>

          <Text style={styles.label}>Date</Text>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"        
            onChange={(_event: any, date?: Date | null) => {
              if (date) {
                setStartDate(date);
              }
            }}
          />

          <Text style={styles.label}>Flow Level</Text>
          <View style={styles.flowRow}>
            {FLOW_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.flowChip, flow === opt.value && styles.flowChipSelected]}
                onPress={() => setFlow(opt.value)}
              >
                <View style={[styles.flowDot, { backgroundColor: opt.color }]} />
                <Text style={styles.flowLabel}>{opt.label}</Text>
              </TouchableOpacity>
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
