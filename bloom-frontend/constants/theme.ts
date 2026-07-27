/**
 * Bloom design tokens — dark, premium theme.
 *
 * Everything visual should be built from these values. If a screen
 * wants a color, spacing value, or font size that isn't here, add a
 * token instead of hardcoding a one-off value — that's what keeps
 * every screen feeling like the same app.
 */

export const colors = {
  // Backgrounds
  bg: '#120E1C',
  bgGradientEnd: '#1B1330',
  surface: 'rgba(255,255,255,0.06)', // glass card fill (used with BlurView)
  surfaceSolid: '#1E1830', // fallback / non-blurred surface
  border: 'rgba(255,255,255,0.09)',

  // Brand gradient — pink to purple, used for the cycle ring, primary
  // buttons, and any "hero" accent. Keep it to those high-impact spots;
  // everything else stays quiet.
  gradientStart: '#FF6FA0',
  gradientEnd: '#8A5CF6',

  // Flat accent colors (chips, badges, icons)
  pink: '#FF6FA0',
  purple: '#8A5CF6',
  gold: '#F0B860',

  // Semantic phase colors — small accents only (dots, chips, ring),
  // never a full screen background.
  period: '#FF6FA0',
  fertile: '#34D399',
  predicted: '#F3A6C4',
  ovulation: '#8A5CF6',

  // Text
  text: '#F6F3FB',
  textMuted: '#A79FB8',
  textFaint: '#6E6580',

  // Status
  success: '#34D399',
  successBg: 'rgba(52,211,153,0.12)',
  danger: '#FF6B81',
  dangerBg: 'rgba(255,107,129,0.12)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  pill: 999,
} as const;

export const fontFamily = {
  display: undefined as string | undefined,
  body: undefined as string | undefined,
};

export const type = {
  display: { fontSize: 30, fontWeight: '700' as const, letterSpacing: -0.5, color: colors.text },
  h1: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3, color: colors.text },
  h2: { fontSize: 19, fontWeight: '700' as const, letterSpacing: -0.2, color: colors.text },
  h3: { fontSize: 16, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text, lineHeight: 21 },
  bodyMuted: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '600' as const, color: colors.textMuted, letterSpacing: 0.4 },
  label: { fontSize: 13, fontWeight: '700' as const, color: colors.textMuted, letterSpacing: 0.3 },
};

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  glow: {
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const phaseMeta: Record<
  'period' | 'fertile' | 'predicted' | 'ovulation',
  { color: string; label: string }
> = {
  period: { color: colors.period, label: 'Period' },
  fertile: { color: colors.fertile, label: 'Fertile' },
  predicted: { color: colors.predicted, label: 'Predicted' },
  ovulation: { color: colors.ovulation, label: 'Ovulation' },
};
