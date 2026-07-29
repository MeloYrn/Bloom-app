import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Screen } from '../../components/ui/Screen';
import { colors, spacing, radius, type, shadow } from '../../constants/theme';

const TOTAL_STEPS = 3;


const COLOR_OPTIONS = [
  { label: 'Clear', swatch: 'rgba(255,255,255,0.15)', border: colors.border },
  { label: 'White / Cream', swatch: '#F5F0E6', border: colors.border },
  { label: 'Yellow / Green', swatch: '#C9D64F', border: '#C9D64F' },
  { label: 'Brown / Pink', swatch: '#B5716B', border: '#B5716B' },
];

const CONSISTENCY_OPTIONS: { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { label: 'Watery', icon: 'water-outline' },
  { label: 'Creamy', icon: 'ice-cream-outline' },
  { label: 'Stretchy', icon: 'resize-outline' },
  { label: 'Thick / Chunky', icon: 'snow-outline' },
];

const ODOR_OPTIONS: { label: string; icon: React.ComponentProps<typeof Ionicons>['name']; tint: string }[] = [
  { label: 'None / Mild', icon: 'checkmark-circle-outline', tint: colors.success },
  { label: 'Strong / Unusual', icon: 'warning-outline', tint: colors.gold },
  { label: 'Fishy', icon: 'alert-circle-outline', tint: colors.danger },
];

export default function DischargeScreen() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      setStep(4);
    }
  };

  const getResult = () => {
    const concerning = ['Yellow / Green', 'Thick / Chunky', 'Strong / Unusual', 'Fishy'];
    const hasConcerning = answers.some((a) => concerning.includes(a));

    if (answers.includes('Fishy')) {
      return {
        status: 'See a Doctor',
        color: colors.danger,
        icon: 'alert-circle' as const,
        message:
          'Your answers suggest discharge that may need medical attention. A fishy odor can be a sign of an infection that is easily treated. Please see a healthcare provider soon.',
      };
    }
    if (hasConcerning) {
      return {
        status: 'Worth Monitoring',
        color: colors.gold,
        icon: 'warning' as const,
        message: 'Some of your answers may indicate a change worth paying attention to. This is not a diagnosis. See a healthcare provider if symptoms persist.',
      };
    }
    return {
      status: 'Likely Normal',
      color: colors.success,
      icon: 'checkmark-circle' as const,
      message: 'Your answers suggest this discharge is typical and healthy. If something still feels off, trust your body and see a healthcare provider.',
    };
  };

  const reset = () => {
    setStep(1);
    setAnswers([]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={type.display}>Discharge Check</Text>
        <Text style={[type.bodyMuted, { marginTop: 2 }]}>Private, judgment-free guidance</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <Text style={[type.caption, { marginTop: 6 }]}>
          {step <= TOTAL_STEPS ? `Step ${step} of ${TOTAL_STEPS}` : 'Complete'}
        </Text>
      </View>

      {step === 1 && (
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          <Text style={type.h1}>What color is the discharge?</Text>
          <Text style={[type.bodyMuted, { marginTop: 6, marginBottom: spacing.lg }]}>
            Select the option that best describes what you see
          </Text>
          {COLOR_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <View style={[styles.swatch, { backgroundColor: opt.swatch, borderColor: opt.border }]} />
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 2 && (
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          <Text style={type.h1}>How would you describe the consistency?</Text>
          <Text style={[type.bodyMuted, { marginTop: 6, marginBottom: spacing.lg }]}>Choose the closest description</Text>
          {CONSISTENCY_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <View style={styles.iconWrap}>
                <Ionicons name={opt.icon} size={20} color={colors.purple} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 3 && (
        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
          <Text style={type.h1}>Is there any unusual odor?</Text>
          <Text style={[type.bodyMuted, { marginTop: 6, marginBottom: spacing.lg }]}>
            Be as honest as you can — this is completely private
          </Text>
          {ODOR_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <View style={[styles.iconWrap, { backgroundColor: opt.tint + '2E' }]}>
                <Ionicons name={opt.icon} size={20} color={opt.tint} />
              </View>
              <Text style={styles.optionLabel}>{opt.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 4 &&
        (() => {
          const result = getResult();
          return (
            <View style={[styles.resultBox, { borderColor: result.color }]}>
              <View style={[styles.resultIconWrap, { backgroundColor: result.color + '26' }]}>
                <Ionicons name={result.icon} size={40} color={result.color} />
              </View>
              <Text style={[styles.resultStatus, { color: result.color }]}>{result.status}</Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={reset}>
                <Text style={styles.resetText}>Start Again</Text>
              </TouchableOpacity>
            </View>
          );
        })()}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.md },
  progressTrack: { backgroundColor: colors.surface, height: 6, borderRadius: radius.sm, marginTop: spacing.md },
  progressFill: { backgroundColor: colors.fertile, height: 6, borderRadius: radius.sm },
  body: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  swatch: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 1.5 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(138,92,246,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  resultBox: {
    flex: 1,
    margin: spacing.lg,
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  resultIconWrap: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  resultStatus: { fontSize: 22, fontWeight: '700', marginBottom: spacing.md },
  resultMessage: { fontSize: 14, color: colors.textMuted, lineHeight: 21, textAlign: 'center', marginBottom: spacing.xl },
  resetBtn: {
    backgroundColor: colors.pink,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
  },
  resetText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});