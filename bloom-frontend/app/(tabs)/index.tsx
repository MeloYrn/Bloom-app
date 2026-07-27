import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, radius, type } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { CycleRing } from '../../components/ui/CycleRing';
import { IconTile } from '../../components/ui/IconTile';
import { PhaseTipCard } from '../../components/ui/PhaseTipCard';

// TODO: replace with real data from your zustand store / API.
const mockUser = { name: 'Serwaa Ampaafo' };
const mockCycle = {
  cycleDay: 21,
  cycleLength: 28,
  periodDays: 5,
  fertileWindow: 7,
  phase: 'Luteal',
  nextPeriodInDays: 7,
  tip: 'Progesterone is peaking. Reduce caffeine, and add magnesium-rich foods like dark chocolate and bananas to ease PMS.',
};

export default function Home() {
  const router = useRouter();

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={type.bodyMuted}>Good morning</Text>
            <Text style={type.h1}>{mockUser.name.split(' ')[0]} 🌸</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => router.push('/profile')}>
            <Text style={styles.avatarText}>{mockUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</Text>
          </Pressable>
        </View>

        <Card style={{ alignItems: 'center', paddingVertical: spacing.xl }}>
          <CycleRing cycleDay={mockCycle.cycleDay} cycleLength={mockCycle.cycleLength} phaseLabel={mockCycle.phase} />
          <Text style={[type.h3, { marginTop: spacing.md }]}>Next period in {mockCycle.nextPeriodInDays} days</Text>

          <View style={styles.statRow}>
            <Stat value={mockCycle.cycleLength} label="Cycle length" />
            <View style={styles.statDivider} />
            <Stat value={mockCycle.periodDays} label="Period days" />
            <View style={styles.statDivider} />
            <Stat value={mockCycle.fertileWindow} label="Fertile window" />
          </View>
        </Card>

        <Text style={[type.label, styles.sectionLabel]}>QUICK ACTIONS</Text>
        <View style={styles.grid}>
          <IconTile icon="calendar-outline" label="Log period" caption="Track your cycle" tint={colors.pink} onPress={() => router.push('/track')} />
          <IconTile icon="chatbubbles-outline" label="Community" caption="Anonymous support" tint={colors.purple} onPress={() => router.push('/community')} />
          <IconTile icon="water-outline" label="Discharge check" caption="Know what's normal" tint={colors.fertile} onPress={() => router.push('/discharge')} />
          <IconTile icon="book-outline" label="Health library" caption="Learn & explore" tint={colors.gold} onPress={() => router.push('/learn')} />
        </View>

        <View style={{ marginTop: spacing.lg }}>
          <PhaseTipCard eyebrow={`PHASE TIP · ${mockCycle.phase.toUpperCase()}`} tip={mockCycle.tip} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <Text style={type.h2}>{value}</Text>
      <Text style={[type.caption, { textAlign: 'center' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.lg },
  avatar: {
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  statRow: {
    flexDirection: 'row', width: '100%', marginTop: spacing.lg, paddingTop: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 2 },
  sectionLabel: { marginTop: spacing.lg, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
