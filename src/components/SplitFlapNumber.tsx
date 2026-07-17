import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '@/hooks/use-theme';

interface SplitFlapCharProps {
  char: string;
}

function SplitFlapChar({ char }: SplitFlapCharProps) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const prevChar = React.useRef(char);

  useEffect(() => {
    if (prevChar.current !== char) {
      // Bounce animation when digit updates
      scale.value = withSequence(
        withTiming(1.15, { duration: 60 }),
        withTiming(1.0, { duration: 90 })
      );
      prevChar.current = char;
    }
  }, [char]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const isDigit = /^[0-9]$/.test(char);

  if (!isDigit) {
    return (
      <View style={styles.nonDigitContainer}>
        <Text style={[styles.nonDigitText, { color: theme.accent }]}>{char}</Text>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.flapCard,
        {
          backgroundColor: theme.backgroundSelected,
          borderColor: theme.accent,
        },
        animatedStyle,
      ]}
    >
      <Text style={[styles.flapText, { color: theme.text }]}>{char}</Text>
    </Animated.View>
  );
}

interface SplitFlapNumberProps {
  value: number;
}

export function SplitFlapNumber({ value }: SplitFlapNumberProps) {
  // Format capital as localized currency with commas: e.g. "$1,234.56"
  const formatted = `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  return (
    <View style={styles.container}>
      {formatted.split('').map((char, index) => (
        <SplitFlapChar key={index} char={char} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 3,
    paddingVertical: 12,
  },
  flapCard: {
    width: 22,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#F39C12',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: '#F39C12',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      }
    }),
  },
  flapText: {
    fontSize: 22,
    fontWeight: '800',
    fontFamily: Platform.select({ ios: 'Courier-Bold', android: 'monospace', default: 'monospace' }),
    textAlign: 'center',
  },
  nonDigitContainer: {
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
  },
  nonDigitText: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: Platform.select({ ios: 'Courier-Bold', android: 'monospace', default: 'monospace' }),
  },
});
