import { TextStyle } from 'react-native';

export const colors = {
  // base
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#252525',
  card: '#1e1e1e',
  border: '#2a2a2a',

  // accent
  primary: '#f97316',
  primaryLight: '#fb923c',
  primaryDark: '#ea580c',
  primaryMuted: 'rgba(249, 115, 22, 0.15)',

  // text
  text: '#f5f5f5',
  textSecondary: '#a3a3a3',
  textMuted: '#737373',
  textInverse: '#0f0f0f',

  // semantic
  success: '#22c55e',
  successMuted: 'rgba(34, 197, 94, 0.15)',
  warning: '#eab308',
  error: '#ef4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#3b82f6',

  // misc
  white: '#ffffff',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

// keeping it simple, no scaling utils for now
// TODO: add responsive font scaling for tablets
export const typography: Record<string, TextStyle> = {
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  number: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
  numberSmall: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontVariant: ['tabular-nums'],
  },
};
