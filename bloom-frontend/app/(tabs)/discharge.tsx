import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, spacing, radius, type } from '../../constants/theme';
import { Screen } from '../../components/ui/Screen';
import { ScreenHeader, Card } from '../../components/ui/Card';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';

type Result = 'normal' | 'see-doctor' | null;

// TODO: wire to your real questionnaire logic.
const QUESTIONS = [
  { key: 'color', prompt: 'What color is the discharge?', options: ['Clear', 'White / cream', 'Yellow / green', 'Brown / pink'] },
  { key: 'texture', prompt: 'What is the texture like?', options: ['Watery', 'Creamy', 'Sticky', 'Clumpy'] },
  { key: 'smell', prompt: 'Is there an unusual smell?', options: ['No smell', 'Mild', 'Strong / fishy'] },
];

export default function DischargeCheck() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Result>(null);
  const question = QUESTIONS[step];

  const choose = (option: string) => {
    const next = { ...answers, [question.key]: option };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      const flagged = next.smell === 'Strong / fishy'; // TODO: replace with real evaluation logic
      setResult(flagged ? 'see-doctor' : 'normal');
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <ScreenHeader title="Discharge Check" subtitle="Private, judgment-free guidance" accentColor={colors.fertile} />

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((result ? QUESTIONS.length : step) / QUESTIONS.length) * 100}%` }]} />
        </View>

        <View style={styles.section}>
          {!result ? (
            <Card>
              <Text style={type.h2}>{question.prompt}</Text>
              <Text style={[type.bodyMuted, { marginTop: 2 }]}>Select the option that best describes what you see</Text>
              <View style={{ marginTop: spacing.md, gap: spacing.sm }}>
                {question.options.map((opt) => (
                  <Chip key={opt} label={opt} color={colors.fertile} onPress={() => choose(opt)} />
                ))}
              </View>
            </Card>
          ) : (
            <View style={[styles.resultCard, result === 'normal' ? { backgroundColor: colors.successBg, borderColor: colors.success } : { backgroundColor: colors.dangerBg, borderColor: colors.danger }]}>
              <Ionicons name={result === 'normal' ? 'checkmark-circle' : 'medical'} size={40} color={result === 'normal' ? colors.success : colors.danger} />
              <Text style={[type.h1, { marginTop: spacing.sm, color: result === 'normal' ? colors.success : colors.danger }]}>
                {result === 'normal' ? 'Likely normal' : 'See a doctor'}
              </Text>
              <Text style={[type.body, { textAlign: 'center', marginTop: spacing.sm }]}>
                {result === 'normal'
                  ? 'Your answers suggest this discharge is typical and healthy. If something still feels off, trust your body and see a healthcare provider.'
                  : 'Your answers suggest discharge that may need medical attention. Please see a healthcare provider soon.'}
              </Text>
              <Button label="Start again" onPress={restart} variant="secondary" style={{ marginTop: spacing.lg, alignSelf: 'stretch' }} />
            </View>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  progressTrack: { height: 4, backgroundColor: colors.border, marginHorizontal: spacing.lg, borderRadius: radius.pill, overflow: 'hidden' },
  progressFill: { height: 4, backgroundColor: colors.fertile },
  resultCard: { borderRadius: radius.lg, borderWidth: 1, padding: spacing.xl, alignItems: 'center' },
});
