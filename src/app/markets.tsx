import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, TextInput, Alert, Image } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { LedgerCard } from '@/components/LedgerCard';
import { StockChart } from '@/components/StockChart';
import { useGameStore, Stock, Crypto } from '@/store/gameStore';
import { formatCurrency, formatCrypto } from '@/utils/formatCurrency';
import { t } from '@/utils/translations';
import {
  TrendingUp, Layers, Wallet, Activity, Truck, Zap,
  Cpu, Coins, Bitcoin, Diamond, Hexagon, Sun, Smile, ChartBar,
} from 'lucide-react-native';

type MarketTab = 'stocks' | 'crypto';

function getStockIcon(symbol: string) {
  const map: Record<string, string> = {
    APEX: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60',
    ZENL: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=80&auto=format&fit=crop&q=60',
    NOVA: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=80&auto=format&fit=crop&q=60',
    QNTM: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=80&auto=format&fit=crop&q=60',
    VIRT: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=80&auto=format&fit=crop&q=60',
    BANK: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=80&auto=format&fit=crop&q=60',
    ITCO: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=80&auto=format&fit=crop&q=60',
  };
  const uri = map[symbol] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=60';
  return <Image source={{ uri }} style={{ width: 26, height: 26, borderRadius: 13 }} resizeMode="cover" />;
}

function getCryptoIcon(symbol: string) {
  const map: Record<string, string> = {
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=032',
    BNB: 'https://cryptologos.cc/logos/binance-coin-bnb-logo.png?v=032',
    SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=032',
    DOGE: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png?v=032',
  };
  const uri = map[symbol] || 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032';
  return <Image source={{ uri }} style={{ width: 26, height: 26, borderRadius: 13 }} resizeMode="contain" />;
}

export default function MarketsScreen() {
  const theme = useTheme();
  const language = useGameStore((state) => state.language);
  const [activeTab, setActiveTab] = useState<MarketTab>('stocks');
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const capital = useGameStore((state) => state.capital);
  const stocks = useGameStore((state) => state.stocks);
  const crypto = useGameStore((state) => state.crypto);
  const buyStock = useGameStore((state) => state.buyStock);
  const sellStock = useGameStore((state) => state.sellStock);
  const buyCrypto = useGameStore((state) => state.buyCrypto);
  const sellCrypto = useGameStore((state) => state.sellCrypto);

  const loc = {
    en: {
      capital: 'CAPITAL',
      stocks: 'STOCKS',
      crypto: 'CRYPTO',
      bullish: '▲ BULLISH',
      bearish: '▼ BEARISH',
      owned: 'Owned',
      shares: 'shares',
      coins: 'coins',
      avgPrice: 'Avg Price',
      volatility: 'Volatility',
      buyMax: 'Buy Max',
      sellAll: 'Sell All',
      sharesPlaceholder: 'Shares',
      coinsPlaceholder: 'Coins (e.g. 0.01)',
      pnl: 'P&L',
      trend: 'Trend',
      value: 'Value',
      buy: 'BUY',
      sell: 'SELL',
      invalidQty: 'Invalid Quantity',
      invalidAmount: 'Invalid Amount',
      insufficientCapital: 'Insufficient Capital',
      notEnoughShares: 'Not Enough Shares',
      notEnoughCoins: 'Not Enough Coins',
    },
    ru: {
      capital: 'КАПИТАЛ',
      stocks: 'АКЦИИ',
      crypto: 'КРИПТА',
      bullish: '▲ РАСТЕТ',
      bearish: '▼ ПАДАЕТ',
      owned: 'В наличии',
      shares: 'акций',
      coins: 'монет',
      avgPrice: 'Ср. цена',
      volatility: 'Колебания',
      buyMax: 'Купить макс',
      sellAll: 'Продать все',
      sharesPlaceholder: 'Акций',
      coinsPlaceholder: 'Кол-во (напр. 0.01)',
      pnl: 'Прибыль',
      trend: 'Тренд',
      value: 'Стоимость',
      buy: 'КУПИТЬ',
      sell: 'ПРОДАТЬ',
      invalidQty: 'Неверное количество',
      invalidAmount: 'Неверная сумма',
      insufficientCapital: 'Недостаточно капитала',
      notEnoughShares: 'Недостаточно акций',
      notEnoughCoins: 'Недостаточно монет',
    }
  };
  const texts = loc[language || 'en'];

  const stockPortfolioValue = stocks.reduce((sum, s) => sum + s.sharesOwned * s.currentPrice, 0);
  const stockPortfolioProfit = stocks.reduce((sum, s) => {
    if (s.sharesOwned === 0) return sum;
    return sum + (s.sharesOwned * s.currentPrice - s.sharesOwned * s.avgBuyPrice);
  }, 0);

  const cryptoPortfolioValue = crypto.reduce((sum, c) => sum + c.coinsOwned * c.currentPrice, 0);
  const cryptoPortfolioProfit = crypto.reduce((sum, c) => {
    if (c.coinsOwned === 0) return sum;
    return sum + (c.coinsOwned * c.currentPrice - c.coinsOwned * c.avgBuyPrice);
  }, 0);

  const handleTextChange = (key: string, val: string) => {
    const numeric = val.replace(/[^0-9.]/g, '');
    setQuantities((prev) => ({ ...prev, [key]: numeric }));
  };

  const handleBuyStock = (s: Stock) => {
    const qty = parseInt(quantities[s.symbol] || '10', 10);
    if (isNaN(qty) || qty <= 0) return Alert.alert(texts.invalidQty);
    if (capital < s.currentPrice * qty) return Alert.alert(texts.insufficientCapital);
    buyStock(s.symbol, qty);
  };

  const handleSellStock = (s: Stock) => {
    const qty = parseInt(quantities[s.symbol] || '10', 10);
    if (isNaN(qty) || qty <= 0) return Alert.alert(texts.invalidQty);
    if (s.sharesOwned < qty) return Alert.alert(texts.notEnoughShares);
    sellStock(s.symbol, qty);
  };

  const handleBuyCrypto = (c: Crypto) => {
    const qty = parseFloat(quantities[c.symbol] || '0.01');
    if (isNaN(qty) || qty <= 0) return Alert.alert(texts.invalidAmount);
    if (capital < c.currentPrice * qty) return Alert.alert(texts.insufficientCapital);
    buyCrypto(c.symbol, qty);
  };

  const handleSellCrypto = (c: Crypto) => {
    const qty = parseFloat(quantities[c.symbol] || '0.01');
    if (isNaN(qty) || qty <= 0) return Alert.alert(texts.invalidAmount);
    if (c.coinsOwned < qty) return Alert.alert(texts.notEnoughCoins);
    sellCrypto(c.symbol, qty);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Portfolio Header */}
      <View style={[styles.portfolioHeader, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <View style={styles.portfolioGrid}>
          <View style={styles.gridItem}>
            <View style={styles.labelRow}>
              <Wallet size={13} color={theme.accent} style={{ marginRight: 4 }} />
              <ThemedText type="small" themeColor="textSecondary">{texts.capital}</ThemedText>
            </View>
            <ThemedText style={[styles.balanceText, { color: theme.accent }]}>{formatCurrency(capital)}</ThemedText>
          </View>
          <View style={[styles.gridItem, { borderLeftWidth: 1, borderLeftColor: theme.border }]}>
            <View style={styles.labelRow}>
              <Layers size={13} color={theme.accent} style={{ marginRight: 4 }} />
              <ThemedText type="small" themeColor="textSecondary">{texts.stocks}</ThemedText>
            </View>
            <ThemedText style={[styles.balanceText, { color: theme.accent }]}>{formatCurrency(stockPortfolioValue)}</ThemedText>
          </View>
          <View style={[styles.gridItem, { borderLeftWidth: 1, borderLeftColor: theme.border }]}>
            <View style={styles.labelRow}>
              <Bitcoin size={13} color="#F7931A" style={{ marginRight: 4 }} />
              <ThemedText type="small" themeColor="textSecondary">{texts.crypto}</ThemedText>
            </View>
            <ThemedText style={[styles.balanceText, { color: '#F7931A' }]}>{formatCurrency(cryptoPortfolioValue)}</ThemedText>
          </View>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabRow, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <Pressable
          onPress={() => setActiveTab('stocks')}
          style={[styles.tabBtn, activeTab === 'stocks' && [styles.tabBtnActive, { borderBottomColor: theme.accent }]]}
        >
          <TrendingUp size={15} color={activeTab === 'stocks' ? theme.accent : theme.textSecondary} />
          <ThemedText style={[styles.tabLabel, { color: activeTab === 'stocks' ? theme.accent : theme.textSecondary }]}>
            {texts.stocks}
          </ThemedText>
          {stockPortfolioProfit !== 0 && (
            <ThemedText style={[styles.tabPnl, { color: stockPortfolioProfit >= 0 ? theme.green : theme.red }]}>
              {stockPortfolioProfit >= 0 ? '+' : ''}{formatCurrency(stockPortfolioProfit)}
            </ThemedText>
          )}
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('crypto')}
          style={[styles.tabBtn, activeTab === 'crypto' && [styles.tabBtnActive, { borderBottomColor: '#F7931A' }]]}
        >
          <Bitcoin size={15} color={activeTab === 'crypto' ? '#F7931A' : theme.textSecondary} />
          <ThemedText style={[styles.tabLabel, { color: activeTab === 'crypto' ? '#F7931A' : theme.textSecondary }]}>
            {texts.crypto}
          </ThemedText>
          {cryptoPortfolioProfit !== 0 && (
            <ThemedText style={[styles.tabPnl, { color: cryptoPortfolioProfit >= 0 ? theme.green : theme.red }]}>
              {cryptoPortfolioProfit >= 0 ? '+' : ''}{formatCurrency(cryptoPortfolioProfit)}
            </ThemedText>
          )}
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        {activeTab === 'stocks' ? (
          // ── STOCKS ──
          stocks.map((s) => {
            const isUp = s.history.length > 1 ? s.currentPrice >= s.history[s.history.length - 2] : true;
            const trendColor = isUp ? theme.green : theme.red;
            const pnl = s.sharesOwned > 0 ? (s.sharesOwned * s.currentPrice - s.sharesOwned * s.avgBuyPrice) : 0;

            return (
              <LedgerCard
                key={s.symbol}
                title={`${s.name} (${s.symbol})`}
                rightTitle={formatCurrency(s.currentPrice)}
                borderAccentColor={trendColor}
              >
                <View style={styles.cardContent}>
                  <View style={styles.stockTitleRow}>
                    <View style={[styles.stockIconBg, { backgroundColor: trendColor + '22' }]}>
                      {getStockIcon(s.symbol)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={[styles.trendBadge, { color: trendColor }]}>
                        {isUp ? texts.bullish : texts.bearish}
                      </ThemedText>
                      {s.sharesOwned > 0 && (
                        <ThemedText style={[styles.pnlText, { color: pnl >= 0 ? theme.green : theme.red }]}>
                          {texts.pnl}: {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        </ThemedText>
                      )}
                    </View>
                  </View>

                  <View style={styles.marketStatusRow}>
                    <View style={styles.chartWrapper}>
                      <StockChart history={s.history} width={130} height={50} />
                    </View>
                    <View style={styles.statsWrapper}>
                      <StatRow label={texts.owned} value={`${s.sharesOwned} ${texts.shares}`} />
                      <StatRow label={texts.avgPrice} value={s.sharesOwned > 0 ? formatCurrency(s.avgBuyPrice) : '—'} />
                      <StatRow label={texts.volatility} value={`${(s.volatility * 100).toFixed(0)}%`} />
                    </View>
                  </View>

                  <TradeControls
                    inputKey={s.symbol}
                    quantities={quantities}
                    onChange={handleTextChange}
                    onBuy={() => handleBuyStock(s)}
                    onSell={() => handleSellStock(s)}
                    onBuyMax={() => buyStock(s.symbol, Math.max(1, Math.floor(capital / s.currentPrice)))}
                    onSellAll={() => sellStock(s.symbol, s.sharesOwned)}
                    canSell={s.sharesOwned > 0}
                    theme={theme}
                    placeholder={texts.sharesPlaceholder}
                    texts={texts}
                  />
                </View>
              </LedgerCard>
            );
          })
        ) : (
          // ── CRYPTO ──
          crypto.map((c) => {
            const isUp = c.history.length > 1 ? c.currentPrice >= c.history[c.history.length - 2] : true;
            const trendColor = isUp ? theme.green : theme.red;
            const pnl = c.coinsOwned > 0 ? (c.coinsOwned * c.currentPrice - c.coinsOwned * c.avgBuyPrice) : 0;

            return (
              <LedgerCard
                key={c.symbol}
                title={`${c.name} (${c.symbol})`}
                rightTitle={c.currentPrice >= 1 ? formatCurrency(c.currentPrice) : `$${c.currentPrice.toFixed(4)}`}
                borderAccentColor={c.color}
              >
                <View style={styles.cardContent}>
                  <View style={styles.stockTitleRow}>
                    <View style={[styles.stockIconBg, { backgroundColor: c.color + '33' }]}>
                      {getCryptoIcon(c.symbol)}
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={[styles.volatilityBar, { backgroundColor: theme.backgroundElement }]}>
                        <View style={[styles.volatilityFill, { width: `${c.volatility * 500}%`, backgroundColor: c.color }]} />
                      </View>
                      <ThemedText style={styles.volatilityLabel}>{texts.volatility}: {(c.volatility * 100).toFixed(0)}%</ThemedText>
                      {c.coinsOwned > 0 && (
                        <ThemedText style={[styles.pnlText, { color: pnl >= 0 ? theme.green : theme.red }]}>
                          {texts.pnl}: {pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}
                        </ThemedText>
                      )}
                    </View>
                  </View>

                  <View style={styles.marketStatusRow}>
                    <View style={styles.chartWrapper}>
                      <StockChart history={c.history} width={130} height={50} />
                    </View>
                    <View style={styles.statsWrapper}>
                      <StatRow label={texts.owned} value={`${formatCrypto(c.coinsOwned)} ${texts.coins}`} />
                      <StatRow label={texts.value} value={c.coinsOwned > 0 ? formatCurrency(c.coinsOwned * c.currentPrice) : '—'} />
                      <StatRow label={texts.trend} value={isUp ? '▲ UP' : '▼ DOWN'} valueColor={trendColor} />
                    </View>
                  </View>

                  <TradeControls
                    inputKey={c.symbol}
                    quantities={quantities}
                    onChange={handleTextChange}
                    onBuy={() => handleBuyCrypto(c)}
                    onSell={() => handleSellCrypto(c)}
                    onBuyMax={() => buyCrypto(c.symbol, Math.max(0.0001, Math.floor((capital / c.currentPrice) * 10000) / 10000))}
                    onSellAll={() => sellCrypto(c.symbol, c.coinsOwned)}
                    canSell={c.coinsOwned > 0}
                    theme={theme}
                    placeholder={texts.coinsPlaceholder}
                    accentColor={c.color}
                    texts={texts}
                  />
                </View>
              </LedgerCard>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

// ─── Reusable Sub-Components ───────────────────────────

function StatRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.metricRow}>
      <ThemedText style={styles.metricLabel}>{label}:</ThemedText>
      <ThemedText style={[styles.metricValue, valueColor ? { color: valueColor } : {}]}>{value}</ThemedText>
    </View>
  );
}

function TradeControls({
  inputKey, quantities, onChange, onBuy, onSell, onBuyMax, onSellAll, canSell, theme, placeholder, accentColor, texts,
}: {
  inputKey: string; quantities: Record<string, string>;
  onChange: (key: string, val: string) => void;
  onBuy: () => void; onSell: () => void;
  onBuyMax: () => void; onSellAll: () => void;
  canSell: boolean; theme: any; placeholder?: string; accentColor?: string; texts: any;
}) {
  const accent = accentColor ?? theme.accent;
  return (
    <>
      <View style={[styles.transactionControls, { borderTopColor: theme.border }]}>
        <TextInput
          value={quantities[inputKey] ?? ''}
          placeholder={placeholder ?? '10'}
          placeholderTextColor={theme.textSecondary}
          keyboardType="decimal-pad"
          onChangeText={(val) => onChange(inputKey, val)}
          style={[styles.qtyInput, { backgroundColor: theme.background, borderColor: theme.border, color: theme.text }]}
        />
        <Pressable onPress={onBuy} style={({ pressed }) => [styles.tradeBtn, { backgroundColor: accent, opacity: pressed ? 0.8 : 1 }]}>
          <ThemedText style={[styles.tradeBtnText, { color: '#fff' }]}>{texts.buy}</ThemedText>
        </Pressable>
        <Pressable
          disabled={!canSell}
          onPress={onSell}
          style={({ pressed }) => [styles.tradeBtn, { backgroundColor: theme.backgroundElement, borderWidth: 1, borderColor: theme.border, opacity: !canSell ? 0.4 : pressed ? 0.8 : 1 }]}
        >
          <ThemedText style={[styles.tradeBtnText, { color: canSell ? theme.text : theme.textSecondary }]}>{texts.sell}</ThemedText>
        </Pressable>
      </View>
      <View style={styles.quickActions}>
        <Pressable onPress={onBuyMax} style={[styles.quickBtn, { backgroundColor: theme.background }]}>
          <ThemedText style={[styles.quickText, { color: accent }]}>{texts.buyMax}</ThemedText>
        </Pressable>
        <Pressable disabled={!canSell} onPress={onSellAll} style={[styles.quickBtn, { backgroundColor: theme.background, opacity: canSell ? 1 : 0.4 }]}>
          <ThemedText style={[styles.quickText, { color: canSell ? theme.red : theme.textSecondary }]}>{texts.sellAll}</ThemedText>
        </Pressable>
      </View>
    </>
  );
}

// ─── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  portfolioHeader: { paddingVertical: 12, borderBottomWidth: 1 },
  portfolioGrid: { flexDirection: 'row' },
  gridItem: { flex: 1, paddingHorizontal: 12, alignItems: 'center' },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  balanceText: { fontSize: 14, fontWeight: '800' },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tabBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: {},
  tabLabel: { fontSize: 12, fontWeight: '800', letterSpacing: 0.5 },
  tabPnl: { fontSize: 10, fontWeight: '700' },
  listContainer: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 40 },
  cardContent: { flexDirection: 'column', marginTop: 4 },
  stockTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  stockIconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  trendBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  pnlText: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  volatilityBar: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 3 },
  volatilityFill: { height: '100%', borderRadius: 2 },
  volatilityLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: '600' },
  marketStatusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  chartWrapper: { flex: 1.2 },
  statsWrapper: { flex: 0.8, gap: 3, paddingLeft: 10 },
  metricRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { fontSize: 10, color: '#9CA3AF' },
  metricValue: { fontSize: 10, fontWeight: '700' },
  transactionControls: { flexDirection: 'row', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderStyle: 'dashed', gap: 6 },
  qtyInput: { flex: 1, height: 36, borderRadius: 6, borderWidth: 1, paddingHorizontal: 10, fontSize: 13, textAlign: 'center' },
  tradeBtn: { flex: 1.2, height: 36, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  tradeBtnText: { fontSize: 12, fontWeight: '800' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  quickBtn: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  quickText: { fontSize: 11, fontWeight: '700' },
});
