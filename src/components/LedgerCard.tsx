import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from './themed-text';

interface LedgerCardProps {
  title?: string;
  subtitle?: string;
  rightTitle?: string;
  children: React.ReactNode;
  borderAccentColor?: string;
}

export function LedgerCard({
  title,
  subtitle,
  rightTitle,
  children,
  borderAccentColor,
}: LedgerCardProps) {
  const theme = useTheme();

  const hasHeader = !!title || !!rightTitle;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.backgroundElement,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Clean top accent line (Stripe-style) */}
      <View
        style={[
          styles.topAccent,
          { backgroundColor: borderAccentColor ?? theme.accent },
        ]}
      />

      <View style={styles.cardInner}>
        {hasHeader ? (
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              {!!title ? (
                <ThemedText type="smallBold" style={styles.titleText}>
                  {title}
                </ThemedText>
              ) : null}
              {!!subtitle ? (
                <ThemedText type="small" themeColor="textSecondary" style={styles.subtitleText}>
                  {subtitle}
                </ThemedText>
              ) : null}
            </View>
            {!!rightTitle ? (
              <ThemedText type="smallBold" style={{ color: borderAccentColor ?? theme.accent, fontSize: 15 }}>
                {rightTitle}
              </ThemedText>
            ) : null}
          </View>
        ) : null}

        {/* Main card contents */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 6,
    overflow: 'hidden',
    flexDirection: 'column',
    alignSelf: 'stretch',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      }
    }),
  },
  topAccent: {
    width: '100%',
    height: 3,
  },
  cardInner: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'column',
    flex: 1,
    paddingRight: 8,
  },
  titleText: {
    fontSize: 14,
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  subtitleText: {
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  content: {
    paddingVertical: 2,
  },
});
