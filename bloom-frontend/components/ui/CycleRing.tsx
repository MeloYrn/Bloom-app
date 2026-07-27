import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors, type } from '../../constants/theme';

const SIZE = 176;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * cycleDay / cycleLength drive the ring fill. Clamped to [0, 1] so a
 * bad upstream value (like the old "51/28" screen) can never render an
 * impossible ring — it caps at "full" instead of lying about the
 * number. The real fix belongs in whatever computes cycleDay.
 */
export function CycleRing({
  cycleDay,
  cycleLength,
  phaseLabel,
}: {
  cycleDay: number;
  cycleLength: number;
  phaseLabel: string;
}) {
  const safeCycleDay = Math.min(Math.max(cycleDay, 0), cycleLength);
  const progress = cycleLength > 0 ? safeCycleDay / cycleLength : 0;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const dots = Array.from({ length: 28 }, (_, i) => i);

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          <LinearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.gradientStart} />
            <Stop offset="1" stopColor={colors.gradientEnd} />
          </LinearGradient>
        </Defs>

        {dots.map((i) => {
          const deg = (i / dots.length) * 360 - 90;
          const rad = deg * (Math.PI / 180);
          const r = RADIUS;
          const on = i / dots.length <= progress;
          return (
            <Circle
              key={i}
              cx={SIZE / 2 + r * Math.cos(rad)}
              cy={SIZE / 2 + r * Math.sin(rad)}
              r={on ? 2.6 : 1.6}
              fill={on ? colors.gradientStart : 'rgba(255,255,255,0.12)'}
            />
          );
        })}

        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS - STROKE}
          stroke="url(#ringGradient)"
          strokeWidth={3}
          strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE}`}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress) * 0.75}
          strokeLinecap="round"
          fill="none"
          rotation={-90}
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          opacity={0.35}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={type.caption}>CYCLE DAY</Text>
        <Text style={[type.display, { fontSize: 34, marginTop: 2 }]}>{safeCycleDay}</Text>
        <Text style={type.bodyMuted}>of {cycleLength}</Text>
        <View style={styles.phasePill}>
          <Text style={styles.phaseText}>{phaseLabel} Phase</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phasePill: {
    marginTop: 8,
    paddingHorizontal: 12,
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(255,111,160,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseText: { fontSize: 12, fontWeight: '700', color: colors.pink },
});
