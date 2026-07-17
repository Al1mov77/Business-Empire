import React from 'react';
import { StyleSheet, View, Pressable, Modal, ScrollView, Alert, Switch } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/translations';
import { X, Globe, Moon, Sun, ShieldAlert, Coins, RefreshCw } from 'lucide-react-native';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const theme = useTheme();
  
  const language = useGameStore((state) => state.language);
  const setLanguage = useGameStore((state) => state.setLanguage);
  
  const themeOverride = useGameStore((state) => state.themeOverride);
  const setThemeOverride = useGameStore((state) => state.setThemeOverride);
  
  const cheatAddMoney = useGameStore((state) => state.cheatAddMoney);
  
  const handleReset = () => {
    Alert.alert(
      t('resetConfirmTitle', language),
      t('resetConfirmDesc', language),
      [
        { text: t('cancel', language), style: 'cancel' },
        { 
          text: t('resetAction', language), 
          style: 'destructive', 
          onPress: () => {
            // Trigger clear/reset in Zustand
            useGameStore.setState({
              capital: 1000,
              totalEarned: 1000,
              prestige: 0,
              netWorth: 1000,
              lastActive: Date.now(),
              offlineEarnings: 0,
              clickPowerLevel: 1,
              dailyRewardStreak: 0,
              lastDailyRewardClaimed: 0,
              businesses: useGameStore.getState().businesses.map(b => ({
                ...b, count: 0, level: 1, employees: [], managerHired: false
              })),
              realEstate: useGameStore.getState().realEstate.map(r => ({
                ...r, count: 0, upgradeLevel: 1
              })),
              luxury: useGameStore.getState().luxury.map(l => ({
                ...l, count: 0
              })),
              nfts: useGameStore.getState().nfts.map(n => ({
                ...n, count: 0
              })),
              flippedCars: useGameStore.getState().flippedCars.map(c => ({
                ...c, status: 'buyable', repairProgress: 0
              })),
              itProjects: useGameStore.getState().itProjects.map(p => ({
                ...p, status: 'idle', progress: 0
              })),
              skyscraperProjects: useGameStore.getState().skyscraperProjects.map(s => ({
                ...s, status: 'idle', progress: 0
              })),
              achievements: useGameStore.getState().achievements.map(a => ({
                ...a, unlocked: false, unlockedAt: undefined
              }))
            });
            onClose();
          } 
        }
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <View style={styles.modalTitleRow}>
              <Moon size={20} color={theme.accent} />
              <ThemedText style={[styles.modalTitle, { color: theme.accent }]}>
                {t('settingsTitle', language).toUpperCase()}
              </ThemedText>
            </View>
            <Pressable onPress={onClose} hitSlop={15}>
              <X size={22} color={theme.textSecondary} />
            </Pressable>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            {/* Language Selection */}
            <View style={[styles.sectionCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={styles.sectionHeader}>
                <Globe size={15} color={theme.accent} />
                <ThemedText style={[styles.sectionTitle, { color: theme.accent }]}>
                  {t('langLabel', language).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.sectionDescription}>
                {language === 'ru' ? 'Выберите язык интерфейса вашей империи.' : 'Select the language interface for your empire.'}
              </ThemedText>
              <View style={[styles.segmentedContainer, { backgroundColor: theme.backgroundElement }]}>
                <Pressable
                  onPress={() => setLanguage('en')}
                  style={[
                    styles.segmentedTabBtn,
                    language === 'en' && { backgroundColor: theme.accent }
                  ]}
                >
                  <ThemedText style={[styles.tabText, language === 'en' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                    English
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setLanguage('ru')}
                  style={[
                    styles.segmentedTabBtn,
                    language === 'ru' && { backgroundColor: theme.accent }
                  ]}
                >
                  <ThemedText style={[styles.tabText, language === 'ru' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                    Русский
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Theme Selection */}
            <View style={[styles.sectionCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
              <View style={styles.sectionHeader}>
                <Sun size={15} color={theme.accent} />
                <ThemedText style={[styles.sectionTitle, { color: theme.accent }]}>
                  {t('themeLabel', language).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.sectionDescription}>
                {language === 'ru' ? 'Настройте цветовую схему игрового экрана.' : 'Choose the visual skin palette for your screen.'}
              </ThemedText>
              <View style={[styles.segmentedContainer, { backgroundColor: theme.backgroundElement }]}>
                <Pressable
                  onPress={() => setThemeOverride('light')}
                  style={[
                    styles.segmentedTabBtn,
                    themeOverride === 'light' && { backgroundColor: theme.accent }
                  ]}
                >
                  <ThemedText style={[styles.tabText, themeOverride === 'light' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                    Light
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setThemeOverride('dark')}
                  style={[
                    styles.segmentedTabBtn,
                    themeOverride === 'dark' && { backgroundColor: theme.accent }
                  ]}
                >
                  <ThemedText style={[styles.tabText, themeOverride === 'dark' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                    Dark
                  </ThemedText>
                </Pressable>
                <Pressable
                  onPress={() => setThemeOverride('system')}
                  style={[
                    styles.segmentedTabBtn,
                    themeOverride === 'system' && { backgroundColor: theme.accent }
                  ]}
                >
                  <ThemedText style={[styles.tabText, themeOverride === 'system' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                    System
                  </ThemedText>
                </Pressable>
              </View>
            </View>

            {/* Developer options */}
            <View style={[styles.sectionCard, { backgroundColor: theme.background, borderColor: theme.red + '30' }]}>
              <View style={styles.sectionHeader}>
                <ShieldAlert size={15} color={theme.red} />
                <ThemedText style={[styles.sectionTitle, { color: theme.red }]}>
                  {t('devOptions', language).toUpperCase()}
                </ThemedText>
              </View>
              <ThemedText style={styles.sectionDescription}>
                {language === 'ru' ? 'Панель отладки и сброса игрового прогресса.' : 'Debug tools and progress wipe controls.'}
              </ThemedText>
              <View style={styles.devActions}>
                <Pressable
                  onPress={() => {
                    cheatAddMoney(100000000); // Give 100M instead of 10M for easier dev testing
                    Alert.alert('Liquidity Boost', 'Secured $100,000,000 corporate funding.');
                  }}
                  style={({ pressed }) => [
                    styles.devBtn,
                    { backgroundColor: theme.green + '15', borderColor: theme.green + '60', opacity: pressed ? 0.8 : 1 }
                  ]}
                >
                  <Coins size={14} color={theme.green} />
                  <ThemedText style={{ color: theme.green, fontSize: 11, fontWeight: '800' }}>
                    {t('cheatBtn', language)}
                  </ThemedText>
                </Pressable>
                
                <Pressable
                  onPress={handleReset}
                  style={({ pressed }) => [
                    styles.devBtn,
                    { backgroundColor: theme.red + '15', borderColor: theme.red + '60', opacity: pressed ? 0.8 : 1 }
                  ]}
                >
                  <RefreshCw size={14} color={theme.red} />
                  <ThemedText style={{ color: theme.red, fontSize: 11, fontWeight: '800' }}>
                    {t('resetBtn', language)}
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    maxHeight: '85%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  modalBody: {
    padding: 16,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  sectionDescription: {
    fontSize: 9.5,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 14,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 3,
    gap: 4,
  },
  segmentedTabBtn: {
    flex: 1,
    height: 36,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  devActions: {
    flexDirection: 'column',
    gap: 8,
  },
  devBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
  },
});
