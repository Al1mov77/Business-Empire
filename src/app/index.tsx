import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions, Vibration } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { LedgerCard as UICard } from '@/components/LedgerCard';
import { SplitFlapNumber } from '@/components/SplitFlapNumber';
import { useGameStore, selectIPS, selectTotalEmployees, getClickReward, getClickUpgradeCost } from '@/store/gameStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { t } from '@/utils/translations';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  DollarSign,
  Landmark,
  ShieldCheck,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Globe,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const language = useGameStore((state) => state.language);

  const capital = useGameStore((state) => state.capital);
  const prestige = useGameStore((state) => state.prestige);
  const netWorth = useGameStore((state) => state.netWorth);
  const totalEarned = useGameStore((state) => state.totalEarned);
  const offlineEarnings = useGameStore((state) => state.offlineEarnings);
  const clickVault = useGameStore((state) => state.clickVault);
  const clearOfflineEarnings = useGameStore((state) => state.clearOfflineEarnings);
  const businesses = useGameStore((state) => state.businesses);
  const ips = useGameStore(selectIPS);
  const totalEmployees = useGameStore(selectTotalEmployees);

  // Click power state fields
  const clickPowerLevel = useGameStore((state) => state.clickPowerLevel);
  const upgradeClickPower = useGameStore((state) => state.upgradeClickPower);
  const rdUpgrades = useGameStore((state) => state.rdUpgrades || {});

  const clickUpgradeCost = getClickUpgradeCost(clickPowerLevel);
  const clickRewardBase = getClickReward(clickPowerLevel);
  const clickPrestigeBonus = Math.floor(prestige / 500);
  const currentClickReward = rdUpgrades['rd_neural_dial']
    ? (clickRewardBase + clickPrestigeBonus) * 2
    : (clickRewardBase + clickPrestigeBonus);

  const clickRewardBaseNext = getClickUpgradeCost(clickPowerLevel + 1) !== 999999999999 ? getClickReward(clickPowerLevel + 1) : 0;
  const nextClickReward = rdUpgrades['rd_neural_dial']
    ? (clickRewardBaseNext + clickPrestigeBonus) * 2
    : (clickRewardBaseNext + clickPrestigeBonus);

  const ownedBusinessCount = businesses.filter(b => b.count > 0).length;

  const dialScale = useSharedValue(1);
  const dialRotation = useSharedValue(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [floatId, setFloatId] = useState(0);

  const handleVaultClick = (event: any) => {
    clickVault();
    Vibration.vibrate(12); // satisfying haptic click

    dialScale.value = withSequence(
      withTiming(0.91, { duration: 50 }),
      withTiming(1.0, { duration: 80 })
    );
    dialRotation.value = withTiming(dialRotation.value + 36, { duration: 120 });

    const clickX = event.nativeEvent.locationX ?? (width / 2);
    const clickY = event.nativeEvent.locationY ?? 100;
    
    // Unified reward math matching store clickVault method
    const clickRewardBase = getClickReward(clickPowerLevel);
    const clickPrestigeBonus = Math.floor(prestige / 500);
    let reward = clickRewardBase + clickPrestigeBonus;
    if (rdUpgrades['rd_neural_dial']) {
      reward *= 2;
    }

    const newFloat = { id: floatId, x: clickX - 25, y: clickY - 20, text: `+${formatCurrency(reward)}` };
    setFloatingTexts((prev) => [...prev, newFloat]);
    setFloatId((id) => id + 1);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== newFloat.id));
    }, 800);
  };

  const animatedDialStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: dialScale.value },
      { rotate: `${dialRotation.value}deg` },
    ],
  }));

  const rankNames = {
    en: { emperor: 'Sector Emperor', galactic_tycoon: 'Galactic Tycoon', multitrillionaire: 'Multitrillionaire', trillionaire: 'Trillionaire', billionaire: 'Billionaire', millionaire: 'Millionaire', executive: 'Executive', entrepreneur: 'Entrepreneur', novice: 'Novice' },
    ru: { emperor: 'Секторный Император', galactic_tycoon: 'Галактический Магнат', multitrillionaire: 'Мультитриллионер', trillionaire: 'Триллионер', billionaire: 'Миллиардер', millionaire: 'Миллионер', executive: 'Директор', entrepreneur: 'Предприниматель', novice: 'Новичок' }
  };
  
  const rankKey =
    netWorth >= 1e15 ? 'emperor' :
    netWorth >= 100e12 ? 'galactic_tycoon' :
    netWorth >= 10e12 ? 'multitrillionaire' :
    netWorth >= 1e12 ? 'trillionaire' :
    netWorth >= 1e9 ? 'billionaire' :
    netWorth >= 1e6 ? 'millionaire' :
    netWorth >= 1e5 ? 'executive' :
    netWorth >= 1e4 ? 'entrepreneur' : 'novice';
  const rank = rankNames[language || 'en'][rankKey];

  const dailyRewardStreak = useGameStore((state) => state.dailyRewardStreak);
  const lastDailyRewardClaimed = useGameStore((state) => state.lastDailyRewardClaimed);
  const claimDailyReward = useGameStore((state) => state.claimDailyReward);

  const now = Date.now();
  const timeDiff = now - lastDailyRewardClaimed;
  const nextStreak = dailyRewardStreak >= 7 || timeDiff > 48 * 3600 * 1000 ? 1 : dailyRewardStreak + 1;
  const canClaimDaily = timeDiff >= 20 * 3600 * 1000;
  const hoursLeft = Math.max(0, Math.ceil((20 * 3600 * 1000 - timeDiff) / (3600 * 1000)));

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Offline Earnings Banner */}
      {offlineEarnings > 0 && (
        <View style={styles.offlineContainer}>
          <UICard title={t('idleReturns', language)} subtitle={t('idleReturnsDesc', language)} borderAccentColor={theme.green}>
            <ThemedText style={styles.receiptLine}>
              {t('idleReturnsDesc', language)}
            </ThemedText>
            <View style={[styles.receiptRow, { borderBottomColor: theme.border }]}>
              <ThemedText type="small">{t('accruedCapital', language)}</ThemedText>
              <ThemedText style={{ color: theme.green, fontWeight: '700' }}>
                +{formatCurrency(offlineEarnings)}
              </ThemedText>
            </View>
            <Pressable
              onPress={clearOfflineEarnings}
              style={({ pressed }) => [
                styles.claimButton,
                { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1, borderColor: theme.border },
              ]}
            >
              <ThemedText type="smallBold" style={{ color: '#fff' }}>{t('claimEarnings', language)}</ThemedText>
            </Pressable>
          </UICard>
        </View>
      )}

      {/* Daily Reward Banner */}
      <View style={styles.dailyRewardContainer}>
        <UICard title={t('dailyGrantTitle', language)} subtitle={t('dailyGrantSubtitle', language, { streak: dailyRewardStreak })} borderAccentColor={theme.accent}>
          <ThemedText style={styles.receiptLine}>
            {t('dailyGrantDesc', language)}
          </ThemedText>
          <Pressable
            disabled={!canClaimDaily}
            onPress={claimDailyReward}
            style={({ pressed }) => [
              styles.claimButton,
              {
                backgroundColor: canClaimDaily ? theme.accent : theme.backgroundSelected,
                opacity: pressed ? 0.8 : 1,
                borderColor: theme.border,
              },
            ]}
          >
            <ThemedText type="smallBold" style={{ color: canClaimDaily ? '#fff' : theme.textSecondary }}>
              {canClaimDaily ? t('claimDaily', language, { day: nextStreak }) : t('dailyClaimed', language, { hours: hoursLeft })}
            </ThemedText>
          </Pressable>
        </UICard>
      </View>

      {/* Net Worth Header */}
      <View style={[styles.netWorthBanner, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <View style={styles.nwRow}>
          <View style={styles.nwItem}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.nwLabel}>{t('capital', language).toUpperCase()}</ThemedText>
            <ThemedText style={[styles.nwValue, { color: theme.accent }]}>{formatCurrency(capital)}</ThemedText>
          </View>
          <View style={[styles.nwDivider, { backgroundColor: theme.border }]} />
          <View style={styles.nwItem}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.nwLabel}>{t('netWorth', language).toUpperCase()}</ThemedText>
            <ThemedText style={[styles.nwValue, { color: theme.green }]}>{formatCurrency(netWorth)}</ThemedText>
          </View>
        </View>
      </View>

      {/* Clicker Upgrade Widget */}
      <View style={{ paddingHorizontal: 12, marginTop: 10 }}>
        <UICard 
          title={language === 'ru' ? 'Модернизация Кликера' : 'Clicker Upgrades'}
          borderAccentColor={theme.accent}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <ThemedText style={{ fontWeight: '700', fontSize: 13 }}>
                {language === 'ru' ? `Сила клика: +${formatCurrency(currentClickReward)}` : `Click Value: +${formatCurrency(currentClickReward)}`}
              </ThemedText>
              <ThemedText style={{ fontSize: 9.5, color: theme.textSecondary }}>
                {clickPowerLevel >= 10 
                  ? (language === 'ru' ? 'Достигнут максимальный уровень' : 'Maximum capacity tier reached')
                  : (language === 'ru' ? `Следующий уровень: +${formatCurrency(nextClickReward)}` : `Next Tier: +${formatCurrency(nextClickReward)}`)}
              </ThemedText>
            </View>
            
            <Pressable
              disabled={capital < clickUpgradeCost || clickPowerLevel >= 10}
              onPress={upgradeClickPower}
              style={({ pressed }) => [
                styles.claimButton,
                {
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  backgroundColor: clickPowerLevel >= 10 ? theme.backgroundSelected : (capital >= clickUpgradeCost ? theme.accent : theme.backgroundSelected),
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                  marginTop: 0,
                }
              ]}
            >
              <ThemedText type="smallBold" style={{ color: clickPowerLevel >= 10 ? theme.textSecondary : (capital >= clickUpgradeCost ? '#fff' : theme.textSecondary) }}>
                {clickPowerLevel >= 10 
                  ? (language === 'ru' ? 'МАКС' : 'MAX')
                  : `${language === 'ru' ? 'УЛУЧШИТЬ' : 'UPGRADE'} (${formatCurrency(clickUpgradeCost)})`}
              </ThemedText>
            </Pressable>
          </View>
        </UICard>
      </View>

      {/* IPS Ticker */}
      <View style={styles.ipsContainer}>
        <TrendingUp size={16} color={theme.green} />
        <ThemedText style={[styles.ipsText, { color: theme.green }]}>
          {formatCurrency(ips)}/{language === 'ru' ? 'сек пассивный доход' : 'sec passive income'}
        </ThemedText>
      </View>

      {/* Vault Clicker */}
      <View style={styles.clickerContainer}>
        <Pressable onPress={handleVaultClick} style={styles.pressableArea}>
          <Animated.View
            style={[
              styles.safeDial,
              { 
                backgroundColor: theme.backgroundElement, 
                borderColor: theme.accent, 
                shadowColor: '#000',
                shadowOpacity: 0.12,
                shadowRadius: 10,
                elevation: 4,
              },
              animatedDialStyle,
            ]}
          >
            <View style={[styles.safeInner, { borderColor: theme.border }]}>
              {[...Array(10)].map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dialTick,
                    {
                      backgroundColor: theme.accent,
                      transform: [{ rotate: `${i * 36}deg` }, { translateY: -62 }],
                    },
                  ]}
                />
              ))}
              <View style={[styles.dialCore, { backgroundColor: theme.accent }]}>
                <Landmark size={30} color={theme.backgroundElement} />
              </View>
            </View>
          </Animated.View>

          {floatingTexts.map((f) => (
            <FloatingFloat key={f.id} text={f.text} startX={f.x} startY={f.y} color={theme.green} />
          ))}
        </Pressable>
        <ThemedText type="small" themeColor="textSecondary" style={styles.clickHint}>
          {t('tapAccumulate', language).toUpperCase()}
        </ThemedText>
      </View>

      {/* Empire Stats */}
      <View style={styles.statsGrid}>
        <StatCard icon={<Briefcase size={18} color={theme.accent} />} label={language === 'ru' ? 'Бизнесы' : 'Businesses'} value={`${ownedBusinessCount}/14`} color={theme.accent} theme={theme} />
        <StatCard icon={<Users size={18} color={theme.green} />} label={language === 'ru' ? 'Штат' : 'Employees'} value={String(totalEmployees)} color={theme.green} theme={theme} />
        <StatCard icon={<Award size={18} color={theme.accent} />} label={t('prestige', language)} value={`${formatCurrency(prestige).replace('$','')} pts`} color={theme.accent} theme={theme} />
        <StatCard icon={<Globe size={18} color={theme.green} />} label={language === 'ru' ? 'Ранг' : 'Rank'} value={rank} color={theme.green} theme={theme} />
      </View>

      {/* Balance Sheet */}
      <View style={styles.balanceSheetContainer}>
        <UICard title={language === 'ru' ? 'Учетная Книга Империи' : 'Empire Ledger'} subtitle={language === 'ru' ? 'Текущее состояние вашей бизнес-империи' : 'Current status of your business empire'}>
          <View style={styles.balanceRow}>
            <View style={styles.rowLabelGroup}>
              <DollarSign size={16} color={theme.accent} style={styles.iconMargin} />
              <ThemedText type="small">{language === 'ru' ? 'Доход от клика:' : 'Click Reward:'}</ThemedText>
            </View>
            <ThemedText type="smallBold" style={{ color: theme.accent }}>
              {formatCurrency(currentClickReward)} / tap
            </ThemedText>
          </View>
          <View style={styles.balanceRow}>
            <View style={styles.rowLabelGroup}>
              <TrendingUp size={16} color={theme.green} style={styles.iconMargin} />
              <ThemedText type="small">{language === 'ru' ? 'Всего заработано:' : 'Total Earned:'}</ThemedText>
            </View>
            <ThemedText type="smallBold" style={{ color: theme.green }}>
              {formatCurrency(totalEarned)}
            </ThemedText>
          </View>
          <View style={styles.balanceRow}>
            <View style={styles.rowLabelGroup}>
              <ShieldCheck size={16} color={theme.green} style={styles.iconMargin} />
              <ThemedText type="small">{language === 'ru' ? 'Рейтинг Империи:' : 'Empire Rating:'}</ThemedText>
            </View>
            <ThemedText type="smallBold" style={{ color: theme.green }}>
              {ownedBusinessCount >= 10 ? 'A++ PLATINUM' : ownedBusinessCount >= 5 ? 'A+ GOLD' : ownedBusinessCount >= 1 ? 'B SILVER' : 'C STARTER'}
            </ThemedText>
          </View>
        </UICard>
      </View>
    </ScrollView>
  );
}

// ─── Sub Components ───────────────────────────

function StatCard({ icon, label, value, color, theme }: any) {
  return (
    <View style={[styles.statCard, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
      {icon}
      <ThemedText style={[styles.statValue, { color }]}>{value}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.statLabel}>{label}</ThemedText>
    </View>
  );
}

interface FloatingFloatProps { text: string; startX: number; startY: number; color: string; }
function FloatingFloat({ text, startX, startY, color }: FloatingFloatProps) {
  const progress = useSharedValue(0);
  const swayOffset = React.useRef((Math.random() - 0.5) * 45).current; // Premium drift sway offset
  
  useEffect(() => { progress.value = withTiming(1, { duration: 750 }); }, []);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [
      { translateY: -progress.value * 90 },
      { translateX: progress.value * swayOffset },
      { scale: 1 + progress.value * 0.3 }
    ],
  }));
  return (
    <Animated.Text style={[styles.floatingFloat, { left: startX, top: startY, color }, animatedStyle]}>
      {text}
    </Animated.Text>
  );
}

// ─── Styles ───────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  offlineContainer: { paddingHorizontal: 16, paddingTop: 16 },
  dailyRewardContainer: { paddingHorizontal: 16, paddingTop: 16 },
  receiptLine: { fontSize: 13, lineHeight: 18, textAlign: 'center', marginVertical: 6 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderStyle: 'dashed', marginBottom: 12 },
  claimButton: { height: 40, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  netWorthBanner: { paddingVertical: 14, borderBottomWidth: 1 },
  nwRow: { flexDirection: 'row', alignItems: 'center' },
  nwItem: { flex: 1, alignItems: 'center' },
  nwLabel: { fontSize: 10, letterSpacing: 1.5, marginBottom: 2 },
  nwValue: { fontSize: 20, fontWeight: '800' },
  nwDivider: { width: 1, height: 36 },
  ipsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  ipsText: { fontSize: 14, fontWeight: '700' },
  clickerContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 20 },
  pressableArea: { width: 210, height: 210, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  safeDial: { width: 180, height: 180, borderRadius: 90, borderWidth: 3, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 10 },
  safeInner: { width: 155, height: 155, borderRadius: 77.5, borderWidth: 2, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  dialTick: { position: 'absolute', width: 4, height: 14, borderRadius: 2 },
  dialCore: { width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },
  floatingFloat: { position: 'absolute', fontSize: 18, fontWeight: 'bold', zIndex: 99 },
  clickHint: { marginTop: 14, fontSize: 11, letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 10, marginBottom: 16 },
  statCard: { flex: 1, minWidth: '44%', borderRadius: 12, borderWidth: 1, padding: 14, alignItems: 'center', gap: 6 },
  statValue: { fontSize: 16, fontWeight: '800' },
  statLabel: { fontSize: 10, letterSpacing: 0.8 },
  balanceSheetContainer: { paddingHorizontal: 16, paddingBottom: 40 },
  balanceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  rowLabelGroup: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { marginRight: 8 },
});
