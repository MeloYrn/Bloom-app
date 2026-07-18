import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { trackingApi } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import { ActivityIndicator } from 'react-native';


const PHASE_TIPS: Record<string, string> = {
  menstrual: 'Your body is shedding the uterine lining. Rest, stay warm, and eat iron-rich foods like leafy greens and beans.',
  follicular: 'Energy levels are rising! Great time to start new activities and be social. Your body is preparing to ovulate.',
  ovulatory: 'You are at peak energy and confidence. Fertile window is open — great time for important conversations and decisions.',
  luteal: 'Progesterone is peaking. Reduce caffeine, increase magnesium-rich foods like dark chocolate and bananas to ease PMS.',
};

const getPhase = (dayOfCycle: number, cycleLength: number): string => {
  if (dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle <= cycleLength / 2 - 2) return 'follicular';
  if (dayOfCycle <= cycleLength / 2 + 2) return 'ovulatory';
  return 'luteal';
};

const getPhaseEmoji = (phase: string): string => {
  const emojis: Record<string, string> = {
    menstrual: '🌑',
    follicular: '🌒',
    ovulatory: '🌕',
    luteal: '🌖',
  };
  return emojis[phase] || '🌸';
};

export default function HomeScreen() {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [phase, setPhase] = useState('luteal');
  const [loading, setLoading] = useState(true);
  const { displayName, logout } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const predictRes = await trackingApi.get('/api/cycles/predict');
      const historyRes = await trackingApi.get('/api/cycles/history');

      if (predictRes.data.nextPeriod) {
        const next = new Date(predictRes.data.nextPeriod);
        const today = new Date();
        const diff = Math.ceil((next.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        setDaysUntil(diff);
        setNextPeriod(predictRes.data.nextPeriod);

        const avgLength = parseInt(predictRes.data.averageCycleLength) || 28;
        setCycleLength(avgLength);

        if (historyRes.data.length > 0) {
          const lastPeriod = new Date(historyRes.data[0].startDate);
          const dayOfCycle = Math.ceil((today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
          setCycleDay(dayOfCycle);
          setPhase(getPhase(dayOfCycle, avgLength));
        }
      }
    } catch (err) {
      console.log('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()} 🌸</Text>
        <Text style={styles.userName}>{displayName || 'Welcome'}</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.cycleCard}>
          {loading ? (
           <ActivityIndicator size="large" color="#fff" style={{marginVertical:20}} />
          ) : daysUntil !== null ? (
            <>
              <Text style={styles.cycleLabel}>Next Period</Text>
              <Text style={styles.cycleValue}>
                {daysUntil <= 0 ? 'Today' : `${daysUntil} days`}
              </Text>
              <Text style={styles.cycleSub}>Expected {nextPeriod} · {cycleLength}-day cycle</Text>
              <View style={styles.cycleRow}>
                <View style={styles.cycleMini}>
                  <Text style={styles.miniLabel}>Phase</Text>
                  <Text style={styles.miniValue}>{phase.charAt(0).toUpperCase() + phase.slice(1)} {getPhaseEmoji(phase)}</Text>
                </View>
                <View style={styles.cycleMini}>
                  <Text style={styles.miniLabel}>Cycle Day</Text>
                  <Text style={styles.miniValue}>{cycleDay ? `${cycleDay} / ${cycleLength}` : '--'}</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.cycleValue}>No data yet</Text>
              <Text style={styles.cycleSub}>Log your first period to get predictions</Text>
            </>
          )}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.qaCard, styles.qaPink]} onPress={() => router.push('/(tabs)/track')}>
            <Text style={styles.qaIcon}>📅</Text>
            <Text style={styles.qaTitle}>Log Period</Text>
            <Text style={styles.qaSub}>Track your cycle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.qaCard, styles.qaPurple]} onPress={() => router.push('/(tabs)/community')}>
            <Text style={styles.qaIcon}>💬</Text>
            <Text style={styles.qaTitle}>Community</Text>
            <Text style={styles.qaSub}>Anonymous support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.qaCard, styles.qaTeal]} onPress={() => router.push('/(tabs)/discharge')}>
            <Text style={styles.qaIcon}>💧</Text>
            <Text style={styles.qaTitle}>Discharge Check</Text>
            <Text style={styles.qaSub}>Know what's normal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.qaCard, styles.qaOrange]} onPress={() => router.push('/(tabs)/learn')}>
            <Text style={styles.qaIcon}>📚</Text>
            <Text style={styles.qaTitle}>Health Library</Text>
            <Text style={styles.qaSub}>Learn & explore</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.tipLabel}>Phase Tip · {phase.charAt(0).toUpperCase() + phase.slice(1)}</Text>
            <Text style={styles.tipText}>{PHASE_TIPS[phase]}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#C2185B',
    padding: 24,
    paddingTop: 50,
  },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginBottom: 2 },
  userName: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20, fontFamily: 'serif' },
  cycleCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  cycleLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 0.5 },
  cycleValue: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginTop: 4 },
  cycleSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  cycleRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cycleMini: { flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10 },
  miniLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  miniValue: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  logoutBtn: {  paddingVertical: 8, paddingHorizontal: 14, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20 },
  logoutText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  body: { padding: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  qaCard: { width: '47%', borderRadius: 18, padding: 16 },
  qaPink: { backgroundColor: '#FCE4EC' },
  qaPurple: { backgroundColor: '#F3E5F5' },
  qaTeal: { backgroundColor: '#E0F2F1' },
  qaOrange: { backgroundColor: '#FFF3E0' },
  qaIcon: { fontSize: 28, marginBottom: 8 },
  qaTitle: { fontSize: 14, fontWeight: '700', color: '#1A1A1A', marginBottom: 2 },
  qaSub: { fontSize: 12, color: '#777' },
  tipCard: {
    backgroundColor: '#6A1B9A',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  tipIcon: { fontSize: 28 },
  tipLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 },
  tipText: { fontSize: 13, color: 'rgba(255,255,255,0.95)', lineHeight: 19 },
});