import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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

      await trackingApi.post('/api/symptoms/log', {
        logDate: startDate.toISOString().split('T')[0],
        cramps: selectedSymptoms.includes('cramps') ? 4 : 0,
        mood: mood + 1,
        energy: 3,
        bloating: selectedSymptoms.includes('bloating'),
        headache: selectedSymptoms.includes('headache'),
        notes: selectedSymptoms.join(', '),
      });

      Alert.alert('Saved!', 'Your period and symptoms have been logged.');
      loadHistory();
    } catch (err) {
      Alert.alert('Error', 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
          </View>
        </View>

        {predictedNext && (
          <View style={styles.predictionBanner}>
            <Text style={styles.predictionText}>
              🌸 Next period predicted: {predictedNext}
            </Text>
          </View>
        )}

{ovulationDay && (
  <View style={styles.ovulationBanner}>
    <Text style={styles.ovulationText}>🥚 Estimated ovulation day: {ovulationDay}</Text>
  </View>
)}
        

        {/* Log form */}
        <View style={styles.logForm}>
          <Text style={styles.sectionTitle}>📝 Log Today's Period</Text>

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

          <Text style={styles.label}>Symptoms</Text>
          <View style={styles.symptomGrid}>
            {SYMPTOM_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s.key}
                style={[
                  styles.symptomItem,
                  selectedSymptoms.includes(s.key) && styles.symptomItemSelected,
                ]}
                onPress={() => toggleSymptom(s.key)}
              >
                <Text style={styles.symptomEmoji}>{s.emoji}</Text>
                <Text style={styles.symptomLabel}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Mood Today</Text>
          <View style={styles.moodRow}>
            {MOOD_OPTIONS.map((emoji, index) => (
              <TouchableOpacity key={index} onPress={() => setMood(index)}>
                <Text style={[styles.moodFace, mood === index && styles.moodFaceActive]}>
                  {emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={saveCycle} disabled={saving}>
            <Text style={styles.saveBtnText}>
              {saving ? 'Saving...' : "Save Today's Log ✓"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Symptom History */}
        {symptomHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>📊 Symptom History</Text>
            {symptomHistory.map((entry, index) => (
              <View key={index} style={styles.historyCard}>
                <Text style={styles.historyDate}>{entry.logDate}</Text>
                <View style={styles.historyChipsRow}>
                  {entry.cramps > 0 && (
                    <View style={styles.historyChip}>
                      <Text style={styles.historyChipText}>😣 Cramps</Text>
                    </View>
                  )}
                  {entry.bloating && (
                    <View style={styles.historyChip}>
                      <Text style={styles.historyChipText}>😟 Bloating</Text>
                    </View>
                  )}
                  {entry.headache && (
                    <View style={styles.historyChip}>
                      <Text style={styles.historyChipText}>🤕 Headache</Text>
                    </View>
                  )}
                </View>
                {entry.notes && <Text style={styles.historyNotes}>{entry.notes}</Text>}
              </View>
            ))}
          </View>
        )}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: '#880E4F', padding: 24, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#F8BBD0', marginTop: 4 },
  body: { padding: 16 },
  calendarCard: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EEE', overflow: 'hidden', marginBottom: 16 },
  legend: { flexDirection: 'row', padding: 12, gap: 16, borderTopWidth: 1, borderColor: '#EEE' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { fontSize: 12, color: '#777' },
  predictionBanner: { backgroundColor: '#FCE4EC', borderRadius: 12, padding: 14, marginBottom: 16 },
  predictionText: { color: '#880E4F', fontWeight: '600', textAlign: 'center' },
  ovulationBanner: { backgroundColor: '#F3E5F5', borderRadius: 12, padding: 14, marginBottom: 16 },
  ovulationText: { color: '#6A1B9A', fontWeight: '600', textAlign: 'center' },
  logForm: { backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#EEE', padding: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#777', textTransform: 'uppercase', marginTop: 16, marginBottom: 10 },
  flowRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  flowChip: { flex: 1, minWidth: 70, paddingVertical: 10, borderRadius: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent', backgroundColor: '#FAFAFA' },
  flowChipSelected: { borderColor: '#C2185B', backgroundColor: '#FCE4EC' },
  flowDot: { width: 20, height: 20, borderRadius: 10, marginBottom: 4 },
  flowLabel: { fontSize: 12, fontWeight: '600' },
  symptomGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomItem: { width: '30%', backgroundColor: '#FAFAFA', borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  symptomItemSelected: { backgroundColor: '#FCE4EC', borderColor: '#C2185B' },
  symptomEmoji: { fontSize: 22, marginBottom: 4 },
  symptomLabel: { fontSize: 11, fontWeight: '600', textAlign: 'center' },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodFace: { fontSize: 24, opacity: 0.4 },
  moodFaceActive: { opacity: 1 },
  saveBtn: { backgroundColor: '#C2185B', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 18 },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  historySection: { marginTop: 20, marginBottom: 20 },
  historyCard: { backgroundColor: '#FAFAFA', borderRadius: 12, padding: 14, marginBottom: 10 },
  historyDate: { fontSize: 13, fontWeight: 'bold', color: '#880E4F', marginBottom: 8 },
  historyChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  historyChip: { backgroundColor: '#FCE4EC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10},
  historyChipText: { fontSize: 11, color: '#c2185b', fontWeight: '600' },
  historyNotes: { fontSize: 12, color: '#777', fontStyle: 'italic' },
});