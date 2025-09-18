import { TextStyle } from 'react-native';

export const typography = {
  // Headlines
  H1: {
    fontSize: 48,
    lineHeight: 58,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  H2: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  H3: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  H4: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  H5: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Subtitles
  S1: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  S2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Body
  B1: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  B1_BOLD: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  B2: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  B2_BOLD: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Caption
  C1: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  C2: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },

  // Label
  LABEL: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
} as const;

// Button Font Styles
export const buttonTypography = {
  GIANT: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  LARGE: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  MEDIUM: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  SMALL: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
  TINY: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0,
  },
} as const;

// Type definitions for TypeScript
export type TypographyKey = keyof typeof typography;
export type ButtonTypographyKey = keyof typeof buttonTypography;
