import React from 'react';
import Svg, { Circle, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '../../constants/theme';

/**
 * Custom line-drawn mood face, 0 (awful) to 4 (great).
 * Replaces system emoji so the mood scale uses the same single-stroke
 * icon language as the rest of the app instead of a different,
 * device-dependent glyph style pasted into a custom UI.
 *
 * Mouth curvature follows the standard "smile = control point below
 * baseline, frown = control point above baseline" convention (same
 * one Feather/Ionicons use for their smile icons) — level 2 (okay) is
 * a flat line, and curvature grows toward either end.
 */
export function MoodFace({
  level,
  selected = false,
  size = 30,
}: {
  level: 0 | 1 | 2 | 3 | 4;
  selected?: boolean;
  size?: number;
}) {
  const stroke = selected ? 'url(#moodGradient)' : 'rgba(255,255,255,0.35)';
  const eyeFill = selected ? colors.gradientEnd : 'rgba(255,255,255,0.35)';

  const baseline = 20;
  const curveOffset = (level - 2) * 3.4; // negative = frown, positive = smile

  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="moodGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={colors.gradientStart} />
          <Stop offset="1" stopColor={colors.gradientEnd} />
        </LinearGradient>
      </Defs>
      <Circle cx={16} cy={16} r={13} stroke={stroke} strokeWidth={1.8} fill="none" />
      <Circle cx={11} cy={14} r={1.5} fill={eyeFill} />
      <Circle cx={21} cy={14} r={1.5} fill={eyeFill} />
      <Path
        d={`M10,${baseline} Q16,${baseline + curveOffset} 22,${baseline}`}
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}
