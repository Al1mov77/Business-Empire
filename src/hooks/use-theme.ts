import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useGameStore } from '@/store/gameStore';

export function useTheme() {
  const themeOverride = useGameStore((state) => state.themeOverride) ?? 'system';
  const scheme = useColorScheme();

  let finalTheme = themeOverride;
  if (themeOverride === 'system') {
    finalTheme = scheme === 'unspecified' || !scheme ? 'dark' : scheme;
  }

  return Colors[finalTheme === 'light' ? 'light' : 'dark'];
}
