import React, { useEffect, useState } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Tabs } from 'expo-router';
import { Coins, Briefcase, TrendingUp, Gem, Trophy, Settings, Landmark } from 'lucide-react-native';
import { useGameStore } from '@/store/gameStore';
import { useTheme } from '@/hooks/use-theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SettingsModal } from '@/components/SettingsModal';
import { t } from '@/utils/translations';
import * as SplashScreen from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const language = useGameStore((state) => state.language);

  const tickGame = useGameStore((state) => state.tickGame);
  const tickStocks = useGameStore((state) => state.tickStocks);
  const tickCrypto = useGameStore((state) => state.tickCrypto);
  const checkAchievements = useGameStore((state) => state.checkAchievements);

  // Animated Splash Screen states
  const [appReady, setAppReady] = useState(false);
  const loadingProgress = useSharedValue(0);
  const logoScale = useSharedValue(0.4);
  const logoRotation = useSharedValue(0);
  const loadingOpacity = useSharedValue(1);

  useEffect(() => {
    // Hide native splash screen
    SplashScreen.hideAsync().catch(() => {});

    // Run loader animations
    logoScale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.5)) });
    logoRotation.value = withTiming(360, { duration: 1800, easing: Easing.out(Easing.quad) });
    loadingProgress.value = withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.quad) });

    const fadeTimer = setTimeout(() => {
      loadingOpacity.value = withTiming(0, { duration: 300 });
      const hideTimer = setTimeout(() => {
        setAppReady(true);
      }, 300);
      return () => clearTimeout(hideTimer);
    }, 2200);

    // Main income tick every 1 second
    const gameTimer = setInterval(() => {
      tickGame(1);
    }, 1000);

    // Balanced: Stocks tick every 8 seconds (was 4s)
    const stockTimer = setInterval(() => {
      tickStocks();
    }, 8000);

    // Balanced: Crypto tick every 12 seconds (was 6s)
    const cryptoTimer = setInterval(() => {
      tickCrypto();
    }, 12000);

    // Achievement check every 5 seconds
    const achTimer = setInterval(() => {
      checkAchievements();
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearInterval(gameTimer);
      clearInterval(stockTimer);
      clearInterval(cryptoTimer);
      clearInterval(achTimer);
    };
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { rotate: `${logoRotation.value}deg` },
    ],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${loadingProgress.value * 100}%`,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.accent,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.backgroundElement,
            borderTopColor: theme.border,
            borderTopWidth: 0.5,
            height: 62 + insets.bottom,
            paddingBottom: insets.bottom,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
          },
          tabBarLabelStyle: {
            fontSize: 9.2,
            fontWeight: '700',
            marginBottom: 4,
            letterSpacing: -0.15,
          },
          tabBarIconStyle: {
            marginTop: 6,
          },
          headerStyle: {
            backgroundColor: theme.backgroundElement,
            borderBottomColor: theme.border,
            borderBottomWidth: 0.5,
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleStyle: {
            fontWeight: '700',
            color: theme.text,
            fontSize: 17,
            letterSpacing: -0.2,
          },
          headerRight: () => (
            <Pressable
              onPress={() => setSettingsVisible(true)}
              style={({ pressed }) => [
                { marginRight: 16, padding: 4, opacity: pressed ? 0.7 : 1 }
              ]}
              hitSlop={15}
            >
              <Settings size={20} color={theme.accent} />
            </Pressable>
          ),
          sceneStyle: {
            backgroundColor: theme.background,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('vaultTitle', language),
            tabBarLabel: t('capital', language),
            tabBarIcon: ({ color, size }) => <Coins color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="businesses"
          options={{
            title: t('corpMergers', language),
            tabBarLabel: t('slots', language),
            tabBarIcon: ({ color, size }) => <Briefcase color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="markets"
          options={{
            title: t('marketsTitle', language),
            tabBarLabel: t('marketsTitle', language),
            tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="assets"
          options={{
            title: t('acquisitionsTitle', language),
            tabBarLabel: t('acquisitionsTitle', language),
            tabBarIcon: ({ color, size }) => <Gem color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="achievements"
          options={{
            title: t('achievementsTitle', language),
            tabBarLabel: t('achievementsTitle', language),
            tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
          }}
        />
      </Tabs>
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />

      {!appReady && (
        <Animated.View style={[styles.splashOverlay, { backgroundColor: '#111827', opacity: loadingOpacity }]}>
          <Animated.View style={[styles.dialContainer, logoAnimatedStyle]}>
            <View style={styles.outerDial}>
              {[...Array(12)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dialTick,
                    {
                      transform: [{ rotate: `${i * 30}deg` }, { translateY: -36 }],
                    },
                  ]}
                />
              ))}
              <View style={styles.innerDial}>
                <Landmark size={36} color="#10B981" />
              </View>
            </View>
          </Animated.View>
          <Animated.Text style={styles.splashTitle}>
            BUSINESS EMPIRE
          </Animated.Text>
          <Animated.Text style={styles.splashSubtitle}>
            {language === 'ru' ? 'ЗАГРУЗКА БИЗНЕС-СИСТЕМ...' : 'LOADING SYSTEMS...'}
          </Animated.Text>
          <View style={styles.progressBarTrack}>
            <Animated.View style={[styles.progressBarFill, progressAnimatedStyle]} />
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  dialContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  outerDial: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDial: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#374151',
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialTick: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#10B981',
    top: '50%',
    left: '50%',
    marginTop: -3,
    marginLeft: -1,
  },
  splashTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F9FAFB',
    letterSpacing: 3,
    marginBottom: 6,
  },
  splashSubtitle: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 1.5,
    marginBottom: 28,
  },
  progressBarTrack: {
    width: width * 0.6,
    height: 3,
    backgroundColor: '#1F2937',
    borderRadius: 1.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
  },
});
