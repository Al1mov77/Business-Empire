import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { useGameStore } from '@/store/gameStore';
import { t } from '@/utils/translations';
import {
  Trophy, Lock, Briefcase, Store, Crown, UserPlus, Users, DollarSign,
  Gem, Star, TrendingUp, Bitcoin, Home, Sparkles, Award, ShieldCheck,
} from 'lucide-react-native';

function getAchievementIcon(icon: string, color: string, size = 22) {
  const map: Record<string, React.ReactElement> = {
    'briefcase': <Briefcase size={size} color={color} />,
    'store': <Store size={size} color={color} />,
    'crown': <Crown size={size} color={color} />,
    'user-plus': <UserPlus size={size} color={color} />,
    'users': <Users size={size} color={color} />,
    'dollar-sign': <DollarSign size={size} color={color} />,
    'badge-dollar-sign': <DollarSign size={size} color={color} />,
    'gem': <Gem size={size} color={color} />,
    'star': <Star size={size} color={color} />,
    'trending-up': <TrendingUp size={size} color={color} />,
    'bitcoin': <Bitcoin size={size} color={color} />,
    'home': <Home size={size} color={color} />,
    'sparkles': <Sparkles size={size} color={color} />,
    'award': <Award size={size} color={color} />,
    'shield-check': <ShieldCheck size={size} color={color} />,
  };
  return map[icon] ?? <Trophy size={size} color={color} />;
}

export default function AchievementsScreen() {
  const theme = useTheme();
  const language = useGameStore((state) => state.language);
  const achievements = useGameStore((state) => state.achievements);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.headerBand, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <View style={styles.trophyRow}>
          <Trophy size={24} color={theme.accent} />
          <View style={styles.headerText}>
            <ThemedText style={[styles.headerTitle, { color: theme.accent }]}>
              {t('achievementsTitle', language).toUpperCase()}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {unlockedCount} / {totalCount} {language === 'ru' ? 'открыто' : 'unlocked'}
            </ThemedText>
          </View>
        </View>
        {/* Progress bar */}
        <View style={[styles.progressTrack, { backgroundColor: theme.background }]}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.accent }]} />
        </View>
        <ThemedText style={[styles.progressPct, { color: theme.accent }]}>
          {t('completeText', language, { pct: progress.toFixed(0) })}
        </ThemedText>
      </View>

      {/* Achievement List */}
      <View style={styles.listContainer}>
        {/* Unlocked */}
        {unlockedCount > 0 && (
          <>
            <ThemedText style={[styles.sectionTitle, { color: theme.green }]}>{t('unlockedSec', language)}</ThemedText>
            {achievements.filter(a => a.unlocked).map(a => (
              <AchievementCard key={a.id} achievement={a} unlocked theme={theme} language={language} />
            ))}
          </>
        )}

        {/* Locked */}
        {achievements.filter(a => !a.unlocked).length > 0 && (
          <>
            <ThemedText style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('lockedSec', language)}</ThemedText>
            {achievements.filter(a => !a.unlocked).map(a => (
              <AchievementCard key={a.id} achievement={a} unlocked={false} theme={theme} language={language} />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

function AchievementCard({ achievement, unlocked, theme, language }: { achievement: any; unlocked: boolean; theme: any; language: 'en' | 'ru' }) {
  const iconColor = unlocked ? theme.accent : theme.textSecondary;
  const unlockedDate = achievement.unlockedAt
    ? new Date(achievement.unlockedAt).toLocaleDateString()
    : null;

  return (
    <View style={[
      styles.achCard,
      {
        backgroundColor: unlocked ? theme.backgroundElement : theme.background,
        borderColor: unlocked ? theme.accent + '44' : theme.border,
        opacity: unlocked ? 1 : 0.6,
      },
    ]}>
      <View style={[styles.achIcon, { backgroundColor: unlocked ? theme.accent + '22' : theme.backgroundElement, borderColor: unlocked ? theme.accent + '44' : theme.border }]}>
        {unlocked
          ? getAchievementIcon(achievement.icon, iconColor)
          : <Lock size={20} color={theme.textSecondary} />
        }
      </View>
      <View style={styles.achInfo}>
        <ThemedText style={[styles.achTitle, { color: unlocked ? theme.accent : theme.textSecondary }]}>
          {achievement.title}
        </ThemedText>
        <ThemedText type="small" themeColor="textSecondary">{achievement.description}</ThemedText>
        {unlocked && unlockedDate && (
          <ThemedText style={styles.achDate}>
            {language === 'ru' ? `Получено: ${unlockedDate}` : `Unlocked: ${unlockedDate}`}
          </ThemedText>
        )}
      </View>
      {unlocked && (
        <View style={[styles.achBadge, { backgroundColor: theme.accent + '22', borderColor: theme.accent + '44' }]}>
          <Trophy size={14} color={theme.accent} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBand: { padding: 20, borderBottomWidth: 1 },
  trophyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  headerText: { gap: 2 },
  headerTitle: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPct: { fontSize: 12, fontWeight: '700', textAlign: 'right' },
  listContainer: { padding: 12, paddingBottom: 40 },
  sectionTitle: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 12, marginBottom: 8, paddingLeft: 4 },
  achCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  achIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  achInfo: { flex: 1, gap: 3 },
  achTitle: { fontSize: 14, fontWeight: '800' },
  achDate: { fontSize: 10, color: '#9CA3AF', marginTop: 2 },
  achBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});
