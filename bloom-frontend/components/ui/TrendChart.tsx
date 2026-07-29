import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '../../constants/theme';

const BAR_SLOT = 40;

/**
 * Minimal bar chart for short trend series (e.g. last 7 days of mood).
 * Built on react-native-svg since that's already a dependency (used by
 * CycleRing) — no chart library needed for something this simple.
 * Width is computed from data.length rather than "100%" so the bars
 * and the labels underneath always line up exactly.
 */
export function TrendChart({
  data,
  maxValue,
  color = colors.pink,
  height = 120,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
  color?: string;
  height?: number;
}) {
  const width = data.length * BAR_SLOT;
  const barWidth = BAR_SLOT - 14;

  return (
    <View>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const rawHeight = maxValue > 0 ? (d.value / maxValue) * (height - 24) : 0;
          const barHeight = d.value > 0 ? Math.max(rawHeight, 4) : 0;
          const x = i * BAR_SLOT + 7;
          const y = height - 20 - barHeight;
          return (
            <Rect
              key={i}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={5}
              fill={color}
              opacity={d.value === 0 ? 0.2 : 0.9}
            />
          );
        })}
      </Svg>
      <View style={[styles.labelRow, { width }]}>
        {data.map((d, i) => (
          <Text key={i} style={[styles.label, { width: BAR_SLOT }]}>
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: { flexDirection: 'row', marginTop: 4 },
  label: { fontSize: 10, color: colors.textFaint, textAlign: 'center' },
});