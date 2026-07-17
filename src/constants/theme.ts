/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111827',              // Gray-900 — crisp dark text
    background: '#F9FAFB',        // Gray-50 — soft off-white
    backgroundElement: '#FFFFFF', // Pure white cards
    backgroundSelected: '#F3F4F6', // Gray-100 — subtle highlight
    textSecondary: '#6B7280',     // Gray-500 — muted labels
    accent: '#059669',            // Emerald-600 — primary brand
    green: '#059669',             // Emerald-600 — profit/success
    red: '#EF4444',               // Red-500 — loss/danger
    border: 'rgba(17, 24, 39, 0.08)',
  },
  dark: {
    text: '#F9FAFB',              // Gray-50 — bright white text
    background: '#111827',        // Gray-900 — deep charcoal
    backgroundElement: '#1F2937', // Gray-800 — elevated surface
    backgroundSelected: '#374151', // Gray-700 — selection highlight
    textSecondary: '#9CA3AF',     // Gray-400 — muted labels
    accent: '#10B981',            // Emerald-500 — primary brand
    green: '#34D399',             // Emerald-400 — profit/success
    red: '#F87171',               // Red-400 — loss/danger
    border: 'rgba(255, 255, 255, 0.10)',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
