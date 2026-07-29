import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { CycleRing } from '../../components/ui/CycleRing';
import { IconTile } from '../../components/ui/IconTile';
import { PhaseTipCard } from '../../components/ui/PhaseTipCard';
import { InsightCard } from '../../components/ui/InsightCard';
import { TrendChart } from '../../components/ui/TrendChart';
import { DailyCheckIn } from '../../components/ui/DailyCheckin';
import { colors, spacing, radius, type } from '../../constants/theme';
import { trackingApi } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';

const PHASE_TIPS: Record<string, string> = {
  menstrual: 'Your body is shedding the uterine lining. Rest, stay warm, and eat iron-rich foods like leafy greens and beans.',
  follicular: 'Energy levels are rising! Great time to start new activities and be social. Your body is preparing to ovulate.',
  ovulatory: 'You are at peak energy and confidence. Fertile window is open — great time for important conversations and decisions.',
  luteal: 'Progesterone is peaking. Reduce caffeine, increase magnesium-rich foods like dark chocolate and bananas to ease PMS.',
};

const PHASE_META: Record<string, { label: string; tint: string }> = {
  menstrual: { label: 'Menstrual', tint: colors.pink },
  follicular: { label: 'Follicular', tint: colors.gold },
  ovulatory: { label: 'Ovulatory', tint: colors.purple },
  luteal: { label: 'Luteal', tint: colors.pink },
};

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps',
  fatigue: 'Fatigue',
  headache: 'Headache',
  bloating: 'Bloating',
  moodSwings: 'Mood Swings',
  hotFlashes: 'Hot Flashes',
};

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getPhase = (dayOfCycle: number, cycleLength: number): string => {
  if (dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle <= cycleLength / 2 - 2) return 'follicular';
  if (dayOfCycle <= cycleLength / 2 + 2) return 'ovulatory';
  return 'luteal';
};

const todayStr = () => new Date().toISOString().split('T')[0];

function FadeInUp({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: any }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 420, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 420, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return <Animated.View style={[{ opacity, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}

export default function HomeScreen() {
  const [daysUntil, setDaysUntil] = useState<number | null>(null);
  const [nextPeriod, setNextPeriod] = useState<string | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [cycleLength, setCycleLength] = useState(28);
  const [cycleHistory, setCycleHistory] = useState<any[]>([]);
  const [symptomHistory, setSymptomHistory] = useState<any[]>([]);
  const [phase, setPhase] = useState('luteal');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [checkInMood, setCheckInMood] = useState<0 | 1 | 2 | 3 | 4 | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const { displayName, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [predictRes, historyRes, symptomsRes] = await Promise.all([
        trackingApi.get('/api/cycles/predict'),
        trackingApi.get('/api/cycles/history'),
        trackingApi.get('/api/symptoms/history').catch(() => ({ data: [] })),
      ]);

      setCycleHistory(historyRes.data || []);
      setSymptomHistory(symptomsRes.data || []);

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const loggedToday = useMemo(
    () => symptomHistory.some((s: any) => s.date === todayStr()),
    [symptomHistory]
  );

  const handleCheckIn = async () => {
    if (checkInMood === null) return;
    setCheckingIn(true);
    try {
      await trackingApi.post('/api/symptoms/log', {
        date: todayStr(),
        symptoms: [],
        mood: checkInMood,
      });
      const symptomsRes = await trackingApi.get('/api/symptoms/history');
      setSymptomHistory(symptomsRes.data || []);
    } catch (err) {
      console.log('Failed to save check-in:', err);
    } finally {
      setCheckingIn(false);
    }
  };

  // --- Insights, derived from data already loaded above ---
  const insights = useMemo(() => {
    // Average cycle length + regularity, from consecutive period start dates
    const sortedStarts = [...cycleHistory]
      .map((c: any) => new Date(c.startDate))
      .sort((a, b) => a.getTime() - b.getTime());

    const gaps: number[] = [];
    for (let i = 1; i < sortedStarts.length; i++) {
      const days = Math.round((sortedStarts[i].getTime() - sortedStarts[i - 1].getTime()) / (1000 * 60 * 60 * 24));
      gaps.push(days);
    }

    let avgLengthLabel = `${cycleLength} days`;
    let regularityLabel = 'Not enough data';
    if (gaps.length > 0) {
      const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      avgLengthLabel = `${Math.round(avg)} days`;
      if (gaps.length >= 2) {
        const variance = gaps.reduce((sum, g) => sum + Math.abs(g - avg), 0) / gaps.length;
        regularityLabel = variance <= 2 ? 'Regular' : 'Irregular';
      }
    }

    // Most-logged symptom
    const counts: Record<string, number> = {};
    symptomHistory.forEach((entry: any) => {
      (entry.symptoms || []).forEach((key: string) => {
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const topKey = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    const topSymptomLabel = topKey ? SYMPTOM_LABELS[topKey] || topKey : 'No symptoms logged';

    return { avgLengthLabel, regularityLabel, topSymptomLabel };
  }, [cycleHistory, symptomHistory, cycleLength]);

  // --- Mood trend, last 7 calendar days ---
  const trendData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    return days.map((d) => {
      const dateStr = d.toISOString().split('T')[0];
      const entry = symptomHistory.find((s: any) => s.date === dateStr);
      return {
        label: WEEKDAY_LABELS[d.getDay()],
        value: typeof entry?.mood === 'number' ? entry.mood + 1 : 0, // shift 0–4 to 1–5 so a logged "awful" day still shows a bar
      };
    });
  }, [symptomHistory]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const phaseMeta = PHASE_META[phase];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.pink} />}
      >
        <FadeInUp delay={0}>
          <View style={styles.headerRow}>
            <View>
              <Text style={type.bodyMuted}>{getGreeting()}</Text>
              <Text style={[type.display, { marginTop: 2 }]}>{displayName || 'Welcome'}</Text>
            </View>
            <TouchableOpacity style={styles.logoutBtn} onPress={logout} hitSlop={8}>
              <Ionicons name="log-out-outline" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </FadeInUp>

        <FadeInUp delay={70}>
          <View style={styles.ringSection}>
            {loading ? (
              <View style={styles.ringLoading}>
                <Text style={type.bodyMuted}>Loading your cycle…</Text>
              </View>
            ) : cycleDay !== null ? (
              <>
                <CycleRing cycleDay={cycleDay} cycleLength={cycleLength} phaseLabel={phaseMeta.label} />
                <View style={styles.nextPeriodPill}>
                  <Ionicons name="calendar-outline" size={14} color={colors.pink} />
                  <Text style={styles.nextPeriodText}>
                    {daysUntil !== null && daysUntil <= 0
                      ? 'Period expected today'
                      : `Next period in ${daysUntil} day${daysUntil === 1 ? '' : 's'}`}
                  </Text>
                </View>
                {nextPeriod && (
                  <Text style={[type.caption, { marginTop: 6 }]}>
                    Expected {nextPeriod} · {cycleLength}-day average cycle
                  </Text>
                )}
              </>
            ) : (
              <View style={styles.ringLoading}>
                <Text style={type.h3}>No data yet</Text>
                <Text style={[type.bodyMuted, { marginTop: 4, textAlign: 'center' }]}>
                  Log your first period to see predictions here
                </Text>
              </View>
            )}
          </View>
        </FadeInUp>

        <View style={styles.body}>
          <FadeInUp delay={130}>
            <DailyCheckIn
              loggedToday={loggedToday}
              mood={checkInMood}
              onSelectMood={setCheckInMood}
              onSubmit={handleCheckIn}
              submitting={checkingIn}
            />
          </FadeInUp>

          <FadeInUp delay={180} style={{ marginTop: spacing.lg }}>
            <Text style={[type.label, { marginBottom: spacing.sm }]}>INSIGHTS</Text>
            <View style={styles.insightsRow}>
              <InsightCard icon="repeat-outline" value={insights.avgLengthLabel} label="Avg. cycle" tint={colors.pink} />
              <InsightCard icon="pulse-outline" value={insights.regularityLabel} label="Regularity" tint={colors.purple} />
              <InsightCard icon="alert-circle-outline" value={insights.topSymptomLabel} label="Top symptom" tint={colors.gold} />
            </View>
          </FadeInUp>

          <FadeInUp delay={230} style={{ marginTop: spacing.lg }}>
            <Text style={[type.label, { marginBottom: spacing.sm }]}>MOOD, LAST 7 DAYS</Text>
            <Card>
              <TrendChart data={trendData} maxValue={5} color={colors.purple} />
            </Card>
          </FadeInUp>

          <FadeInUp delay={280}>
            <Text style={[type.label, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>QUICK ACTIONS</Text>
            <View style={styles.quickActions}>
              <IconTile
                icon="calendar-outline"
                label="Log Period"
                caption="Track your cycle"
                tint={colors.pink}
                onPress={() => router.push('/(tabs)/track')}
              />
              <IconTile
                icon="chatbubbles-outline"
                label="Community"
                caption="Anonymous support"
                tint={colors.purple}
                onPress={() => router.push('/(tabs)/community')}
              />
              <IconTile
                icon="water-outline"
                label="Discharge Check"
                caption="Know what's normal"
                tint={colors.fertile}
                onPress={() => router.push('/(tabs)/discharge')}
              />
              <IconTile
                icon="book-outline"
                label="Health Library"
                caption="Learn & explore"
                tint={colors.gold}
                onPress={() => router.push('/(tabs)/learn')}
              />
            </View>
          </FadeInUp>

          <FadeInUp delay={330} style={{ marginTop: spacing.lg }}>
            <PhaseTipCard eyebrow={`PHASE TIP · ${phaseMeta.label.toUpperCase()}`} tip={PHASE_TIPS[phase]} />
          </FadeInUp>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  logoutBtn: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSection: { alignItems: 'center', paddingVertical: spacing.xl },
  ringLoading: { height: 176, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  nextPeriodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,111,160,0.12)',
  },
  nextPeriodText: { fontSize: 13, fontWeight: '600', color: colors.pink },
  body: { paddingHorizontal: spacing.lg },
  insightsRow: { flexDirection: 'row', gap: spacing.sm },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});