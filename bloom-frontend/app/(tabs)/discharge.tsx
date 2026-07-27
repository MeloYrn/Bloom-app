import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const TOTAL_STEPS = 3;

const COLOR_OPTIONS = [
  { label: 'Clear', emoji: '⚪' },
  { label: 'White / Cream', emoji: '🤍' },
  { label: 'Yellow / Green', emoji: '🟡' },
  { label: 'Brown / Pink', emoji: '🟤' },
];

const CONSISTENCY_OPTIONS = [
  { label: 'Watery', emoji: '💧' },
  { label: 'Creamy', emoji: '🥛' },
  { label: 'Stretchy', emoji: '🧴' },
  { label: 'Thick / Chunky', emoji: '❄️' },
];

const ODOR_OPTIONS = [
  { label: 'None / Mild', emoji: '✅' },
  { label: 'Strong / Unusual', emoji: '⚠️' },
  { label: 'Fishy', emoji: '🚨' },
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
        color: '#DC2626',
        emoji: '🚨',
        message: 'Your answers suggest discharge that may need medical attention. A fishy odor can be a sign of an infection that is easily treated. Please see a healthcare provider soon.',
      };
    }
    if (hasConcerning) {
      return {
        status: 'Worth Monitoring',
        color: '#F59E0B',
        emoji: '⚠️',
        message: 'Some of your answers may indicate a change worth paying attention to. This is not a diagnosis. See a healthcare provider if symptoms persist.',
      };
    }
    return {
      status: 'Likely Normal',
      color: '#059669',
      emoji: '✅',
      message: 'Your answers suggest this discharge is typical and healthy. If something still feels off, trust your body and see a healthcare provider.',
    };
  };

  const reset = () => {
    setStep(1);
    setAnswers([]);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discharge Check</Text>
        <Text style={styles.headerSub}>Private, judgment-free guidance</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {step <= TOTAL_STEPS ? `Step ${step} of ${TOTAL_STEPS}` : 'Complete'}
        </Text>
      </View>

      {step === 1 && (
        <ScrollView style={styles.body}>
          <Text style={styles.question}>What color is the discharge?</Text>
          <Text style={styles.hint}>Select the option that best describes what you see</Text>
          {COLOR_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 2 && (
        <ScrollView style={styles.body}>
          <Text style={styles.question}>How would you describe the consistency?</Text>
          <Text style={styles.hint}>Choose the closest description</Text>
          {CONSISTENCY_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 3 && (
        <ScrollView style={styles.body}>
          <Text style={styles.question}>Is there any unusual odor?</Text>
          <Text style={styles.hint}>Be as honest as you can — this is completely private</Text>
          {ODOR_OPTIONS.map((opt) => (
            <TouchableOpacity key={opt.label} style={styles.option} onPress={() => handleAnswer(opt.label)}>
              <Text style={styles.optionEmoji}>{opt.emoji}</Text>
              <Text style={styles.optionLabel}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {step === 4 && (() => {
        const result = getResult();
        return (
          <View style={[styles.resultBox, { borderColor: result.color }]}>
            <Text style={styles.resultEmoji}>{result.emoji}</Text>
            <Text style={[styles.resultStatus, { color: result.color }]}>{result.status}</Text>
            <Text style={styles.resultMessage}>{result.message}</Text>
            <TouchableOpacity style={styles.resetBtn} onPress={reset}>
              <Text style={styles.resetText}>Start Again</Text>
            </TouchableOpacity>
          </View>
        );
      })()}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#00695C', padding: 24, paddingTop: 50 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub: { fontSize: 13, color: '#B2DFDB', marginTop: 4 },
  progressTrack: { backgroundColor: 'rgba(255,255,255,0.25)', height: 6, borderRadius: 4, marginTop: 16 },
  progressFill: { backgroundColor: '#fff', height: 6, borderRadius: 4 },
  progressLabel: { fontSize: 12, color: '#B2DFDB', marginTop: 4 },
  body: { flex: 1, padding: 20, backgroundColor: '#fff' },
  question: { fontSize: 20, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 6 },
  hint: { fontSize: 13, color: '#777', marginBottom: 20 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
            borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 16, padding: 16, marginBottom: 10 },
  optionEmoji: { fontSize: 24, marginRight: 14 },
  optionLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
  resultBox: { flex: 1, margin: 20, padding: 24, borderRadius: 20, borderWidth: 3,
               alignItems: 'center', justifyContent: 'center' },
  resultEmoji: { fontSize: 48, marginBottom: 12 },
  resultStatus: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  resultMessage: { fontSize: 14, color: '#555', lineHeight: 21, textAlign: 'center', marginBottom: 24 },
  resetBtn: { backgroundColor: '#00695C', paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12 },
  resetText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});
