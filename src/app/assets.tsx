import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { LedgerCard } from '@/components/LedgerCard';
import { useGameStore } from '@/store/gameStore';
import { formatCurrency } from '@/utils/formatCurrency';
import { t } from '@/utils/translations';
import { INITIAL_REAL_ESTATE, INITIAL_LUXURY } from '@/constants/initialData';
import { LOCAL_IMAGES } from '@/constants/localImages';
import {
  Building, Home, Building2, Ship, Car, Plane, Trophy, MapPin, Sparkles, Award,
  Clock, Gem, Vault, Bitcoin, Coins, Rocket, Smile, Eye,
} from 'lucide-react-native';

type TabType = 'real_estate' | 'car' | 'yacht' | 'plane' | 'jewelry' | 'garage';
type ClassFilter = 'all' | 'economy' | 'medium' | 'business' | 'luxury';

interface SafeImageProps {
  uri?: string;
  fallback: string;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

function SafeImage({ uri, fallback, style, resizeMode = 'cover' }: SafeImageProps) {
  const [source, setSource] = useState(() => {
    if (uri && LOCAL_IMAGES[uri]) {
      return LOCAL_IMAGES[uri];
    }
    return uri ? { uri } : { uri: fallback };
  });
  const [error, setError] = useState(false);

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onError={() => {
        if (!error) {
          setError(true);
          setSource({ uri: fallback });
        }
      }}
    />
  );
}

export default function AssetsScreen() {
  const theme = useTheme();
  const language = useGameStore((state) => state.language);
  const [activeTab, setActiveTab] = useState<TabType>('real_estate');
  const [classFilter, setClassFilter] = useState<ClassFilter>('all');

  const capital = useGameStore((state) => state.capital);
  const prestige = useGameStore((state) => state.prestige);
  const rawRealEstate = useGameStore((state) => state.realEstate);
  const buyRealEstate = useGameStore((state) => state.buyRealEstate);
  const sellRealEstate = useGameStore((state) => state.sellRealEstate);
  const upgradeProperty = useGameStore((state) => state.upgradeProperty);
  const rawLuxury = useGameStore((state) => state.luxury);
  const buyLuxury = useGameStore((state) => state.buyLuxury);
  const sellLuxury = useGameStore((state) => state.sellLuxury);
  const crypto = useGameStore((state) => state.crypto);

  // Dynamic merge of INITIAL data to resolve missing properties or URLs from old saves
  const realEstate = INITIAL_REAL_ESTATE.map(newItem => {
    const existing = rawRealEstate?.find(r => r.id === newItem.id);
    return {
      ...newItem,
      count: existing ? existing.count : 0,
      upgradeLevel: existing ? existing.upgradeLevel : 1,
      upgradeCost: existing && existing.upgradeCost ? existing.upgradeCost : newItem.upgradeCost,
    };
  });

  const luxury = INITIAL_LUXURY.map(newItem => {
    const existing = rawLuxury?.find(l => l.id === newItem.id);
    return {
      ...newItem,
      count: existing ? existing.count : 0,
    };
  });

  const ethWallet = crypto.find(c => c.symbol === 'ETH');
  const ethBalance = ethWallet ? ethWallet.coinsOwned : 0;

  const totalRealEstateIncome = realEstate.reduce((sum, r) => sum + r.count * r.rent, 0);

  // Counters for tabs (using total count of owned items)
  const countRealEstate = realEstate.reduce((sum, r) => sum + r.count, 0);
  const countCars = luxury.filter(l => l.category === 'car').reduce((sum, l) => sum + l.count, 0);
  const countYachts = luxury.filter(l => l.category === 'yacht').reduce((sum, l) => sum + l.count, 0);
  const countPlanes = luxury.filter(l => l.category === 'plane').reduce((sum, l) => sum + l.count, 0);
  const countJewelry = luxury.filter(l => l.category === 'jewelry').reduce((sum, l) => sum + l.count, 0);

  // Garage combined list of owned properties and luxury transport
  const ownedRealEstate = realEstate.filter(r => r.count > 0).map(r => ({ ...r, type: 'real_estate' as const }));
  const ownedLuxury = luxury.filter(l => l.count > 0).map(l => ({ ...l, type: 'luxury' as const }));
  const garageItems = [...ownedRealEstate, ...ownedLuxury];
  const countGarage = garageItems.reduce((sum, item) => sum + item.count, 0);

  // Filter lists based on tab and sub-class selection
  const getFilteredItems = () => {
    if (activeTab === 'real_estate') {
      return realEstate.filter(r => classFilter === 'all' || r.class === classFilter);
    }
    if (activeTab === 'garage') {
      return garageItems;
    }
    const subList = luxury.filter(l => l.category === activeTab);
    return subList.filter(l => classFilter === 'all' || l.class === classFilter);
  };

  const currentList = getFilteredItems();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setClassFilter('all');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header Band */}
      <View style={[styles.headerBand, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
        <View style={styles.headerItem}>
          <ThemedText style={styles.headerLabel}>{t('capital', language).toUpperCase()}</ThemedText>
          <ThemedText style={[styles.headerValue, { color: theme.accent }]}>
            {formatCurrency(capital)}
          </ThemedText>
        </View>
        <View style={[styles.headerDivider, { backgroundColor: theme.border }]} />
        <View style={styles.headerItem}>
          <ThemedText style={styles.headerLabel}>{t('rentIncome', language).toUpperCase()}</ThemedText>
          <ThemedText style={[styles.headerValue, { color: theme.green }]}>
            {formatCurrency(totalRealEstateIncome)}/s
          </ThemedText>
        </View>
        <View style={[styles.headerDivider, { backgroundColor: theme.border }]} />
        <View style={styles.headerItem}>
          <ThemedText style={styles.headerLabel}>{t('prestige', language).toUpperCase()}</ThemedText>
          <ThemedText style={[styles.headerValue, { color: theme.accent }]}>
            {prestige.toLocaleString()} pts
          </ThemedText>
        </View>
      </View>

      {/* Primary Tabs (Real Estate, Cars, Yachts, Planes, Jewelry, Garage) */}
      <View style={{ height: 48, borderBottomWidth: 0.5, borderBottomColor: theme.border, backgroundColor: theme.backgroundElement }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
          <Pressable
            onPress={() => handleTabChange('real_estate')}
            style={[styles.tabBtn, activeTab === 'real_estate' && [styles.tabBtnActive, { borderBottomColor: theme.green }]]}
          >
            <Building size={14} color={activeTab === 'real_estate' ? theme.green : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'real_estate' ? theme.green : theme.textSecondary }]}>
              {t('realEstateTab', language)} ({countRealEstate})
            </ThemedText>
          </Pressable>
          
          <Pressable
            onPress={() => handleTabChange('car')}
            style={[styles.tabBtn, activeTab === 'car' && [styles.tabBtnActive, { borderBottomColor: theme.accent }]]}
          >
            <Car size={14} color={activeTab === 'car' ? theme.accent : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'car' ? theme.accent : theme.textSecondary }]}>
              {t('carsTab', language)} ({countCars})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange('yacht')}
            style={[styles.tabBtn, activeTab === 'yacht' && [styles.tabBtnActive, { borderBottomColor: theme.accent }]]}
          >
            <Ship size={14} color={activeTab === 'yacht' ? theme.accent : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'yacht' ? theme.accent : theme.textSecondary }]}>
              {t('yachtsTab', language)} ({countYachts})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange('plane')}
            style={[styles.tabBtn, activeTab === 'plane' && [styles.tabBtnActive, { borderBottomColor: theme.accent }]]}
          >
            <Plane size={14} color={activeTab === 'plane' ? theme.accent : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'plane' ? theme.accent : theme.textSecondary }]}>
              {t('planesTab', language)} ({countPlanes})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange('jewelry')}
            style={[styles.tabBtn, activeTab === 'jewelry' && [styles.tabBtnActive, { borderBottomColor: '#627EEA' }]]}
          >
            <Gem size={14} color={activeTab === 'jewelry' ? '#627EEA' : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'jewelry' ? '#627EEA' : theme.textSecondary }]}>
              {t('jewelryTab', language)} ({countJewelry})
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => handleTabChange('garage')}
            style={[styles.tabBtn, activeTab === 'garage' && [styles.tabBtnActive, { borderBottomColor: theme.red }]]}
          >
            <Vault size={14} color={activeTab === 'garage' ? theme.red : theme.textSecondary} />
            <ThemedText style={[styles.tabLabel, { color: activeTab === 'garage' ? theme.red : theme.textSecondary }]}>
              {t('garageTab', language)} ({countGarage})
            </ThemedText>
          </Pressable>
        </ScrollView>
      </View>

      {/* Class Filters Sub-Bar */}
      {activeTab !== 'garage' && (
        <View style={[styles.filterBar, { backgroundColor: theme.background }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <Pressable
              onPress={() => setClassFilter('all')}
              style={[styles.filterChip, classFilter === 'all' && [styles.filterChipActive, { backgroundColor: theme.accent }]]}
            >
              <ThemedText style={[styles.filterChipText, classFilter === 'all' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                {t('allClass', language)}
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => setClassFilter('economy')}
              style={[styles.filterChip, classFilter === 'economy' && [styles.filterChipActive, { backgroundColor: theme.accent }]]}
            >
              <ThemedText style={[styles.filterChipText, classFilter === 'economy' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                {t('ecoClass', language)}
              </ThemedText>
            </Pressable>
            {activeTab !== 'real_estate' ? (
              <Pressable
                onPress={() => setClassFilter('medium')}
                style={[styles.filterChip, classFilter === 'medium' && [styles.filterChipActive, { backgroundColor: theme.accent }]]}
              >
                <ThemedText style={[styles.filterChipText, classFilter === 'medium' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                  {t('medClass', language)}
                </ThemedText>
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setClassFilter('business')}
                style={[styles.filterChip, classFilter === 'business' && [styles.filterChipActive, { backgroundColor: theme.accent }]]}
              >
                <ThemedText style={[styles.filterChipText, classFilter === 'business' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                  {t('busClass', language)}
                </ThemedText>
              </Pressable>
            )}
            <Pressable
              onPress={() => setClassFilter('luxury')}
              style={[styles.filterChip, classFilter === 'luxury' && [styles.filterChipActive, { backgroundColor: theme.accent }]]}
            >
              <ThemedText style={[styles.filterChipText, classFilter === 'luxury' ? { color: '#000', fontWeight: '800' } : { color: theme.textSecondary }]}>
                {t('luxClass', language)}
              </ThemedText>
            </Pressable>
          </ScrollView>
        </View>
      )}

      {/* Main Assets List */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {currentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Eye size={28} color={theme.textSecondary} />
            <ThemedText type="small" themeColor="textSecondary" style={{ marginTop: 8 }}>
              {language === 'ru' ? 'Нет объектов в этой категории' : 'No items found in this category'}
            </ThemedText>
          </View>
        ) : (
          currentList.map((item) => {
            const canBuy = capital >= item.cost;
            
            if (activeTab === 'garage') {
              // Unified Garage Item Render
              const isRE = 'location' in item; // Real estate has 'location' field
              const refund = Math.round(item.cost * 0.7);
              
              const handleSell = () => {
                Alert.alert(
                  language === 'ru' ? 'Продажа имущества' : 'Sell Asset',
                  language === 'ru' 
                    ? `Вы действительно хотите продать ${item.name} за ${formatCurrency(refund)}? Комиссия за продажу составляет 30%.` 
                    : `Are you sure you want to sell ${item.name} for ${formatCurrency(refund)}? Resale commission is 30%.`,
                  [
                    { text: language === 'ru' ? 'Отмена' : 'Cancel', style: 'cancel' },
                    { 
                      text: language === 'ru' ? 'Продать' : 'Sell', 
                      style: 'destructive',
                      onPress: () => {
                        if (isRE) {
                          sellRealEstate(item.id);
                        } else {
                          sellLuxury(item.id);
                        }
                      }
                    }
                  ]
                );
              };

              let categoryLabel = '';
              let assetIcon = null;
              
              if (isRE) {
                categoryLabel = language === 'ru' ? 'Недвижимость' : 'Real Estate';
                assetIcon = <Building2 size={12} color={theme.green} />;
              } else {
                const lux = item as typeof luxury[0];
                if (lux.category === 'car') {
                  categoryLabel = language === 'ru' ? 'Автомобиль' : 'Car';
                  assetIcon = <Car size={12} color={theme.accent} />;
                } else if (lux.category === 'yacht') {
                  categoryLabel = language === 'ru' ? 'Яхта' : 'Yacht';
                  assetIcon = <Ship size={12} color={theme.accent} />;
                } else if (lux.category === 'plane') {
                  categoryLabel = language === 'ru' ? 'Самолет' : 'Plane';
                  assetIcon = <Plane size={12} color={theme.accent} />;
                } else {
                  categoryLabel = language === 'ru' ? 'Драгоценность' : 'Jewelry';
                  assetIcon = <Gem size={12} color="#627EEA" />;
                }
              }

              return (
                <LedgerCard
                  key={item.id}
                  title={item.name}
                  rightTitle={`×${item.count}`}
                  borderAccentColor={theme.red}
                >
                  <View style={styles.cardContent}>
                    {item.imageUrl && (
                      <SafeImage
                        uri={item.imageUrl}
                        fallback="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=60"
                        style={styles.assetImage}
                      />
                    )}

                    <View style={styles.locationRow}>
                      {assetIcon}
                      <ThemedText type="small" themeColor="textSecondary" style={{ marginLeft: 4 }}>
                        {categoryLabel} {isRE ? `— ${(item as any).location}` : ''}
                      </ThemedText>
                    </View>

                    <View style={styles.statsRow}>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>
                          {isRE ? (language === 'ru' ? 'ДОХОД/СЕК' : 'RENT/S') : (language === 'ru' ? 'ПРЕСТИЖ' : 'PRESTIGE')}
                        </ThemedText>
                        <ThemedText style={[styles.statValue, { color: isRE ? theme.green : theme.accent }]}>
                          {isRE ? `+${formatCurrency((item as any).rent)}/s` : `+${(item as any).prestige.toLocaleString()} pts`}
                        </ThemedText>
                      </View>
                      
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{language === 'ru' ? 'КОЛИЧЕСТВО' : 'OWNED'}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: theme.text }]}>
                          {item.count}
                        </ThemedText>
                      </View>

                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{language === 'ru' ? 'ОБЩИЙ ЭФФЕКТ' : 'TOTAL EFFECT'}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: isRE ? theme.green : theme.accent, fontSize: 10 }]}>
                          {isRE ? `+${formatCurrency((item as any).rent * item.count)}/s` : `+${((item as any).prestige * item.count).toLocaleString()} pts`}
                        </ThemedText>
                      </View>
                    </View>

                    <Pressable
                      onPress={handleSell}
                      style={({ pressed }) => [
                        styles.buyBtn,
                        { backgroundColor: theme.red + '15', borderColor: theme.red, opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      <ThemedText style={[styles.buyBtnLabel, { color: theme.red }]}>
                        {language === 'ru' ? 'ПРОДАТЬ' : 'SELL ASSET'}
                      </ThemedText>
                      <ThemedText style={[styles.buyBtnCost, { color: theme.red }]}>
                        +{formatCurrency(refund)}
                      </ThemedText>
                    </Pressable>
                  </View>
                </LedgerCard>
              );
            }

            if (activeTab === 'real_estate') {
              // Real Estate Render (contains upgrades and rent yields)
              const r = item as typeof realEstate[0];
              const currentRent = r.count * r.rent;
              return (
                <LedgerCard
                  key={r.id}
                  title={r.name}
                  rightTitle={r.count > 0 ? `×${r.count}` : ''}
                  borderAccentColor={r.count > 0 ? theme.green : theme.textSecondary}
                >
                  <View style={styles.cardContent}>
                    {r.imageUrl && (
                      <SafeImage
                        uri={r.imageUrl}
                        fallback="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&auto=format&fit=crop&q=60"
                        style={styles.assetImage}
                      />
                    )}

                    <View style={styles.locationRow}>
                      <MapPin size={13} color={theme.textSecondary} style={{ marginRight: 4 }} />
                      <ThemedText type="small" themeColor="textSecondary">{r.location}</ThemedText>
                    </View>

                    {r.count > 0 && (
                      <View style={styles.upgradeRow}>
                        <ThemedText style={{ fontSize: 10, color: theme.green, fontWeight: '800', marginRight: 4 }}>
                          {t('upgradeBtnLabel', language)} LVL {r.upgradeLevel}/5
                        </ThemedText>
                        {[...Array(5)].map((_, i) => (
                          <View
                            key={i}
                            style={[
                              styles.levelPip,
                              { backgroundColor: i < r.upgradeLevel ? theme.green : theme.backgroundElement, borderColor: theme.border }
                            ]}
                          />
                        ))}
                      </View>
                    )}

                    <View style={styles.statsRow}>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('yieldUnit', language)}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: theme.green }]}>{formatCurrency(r.rent)}/s</ThemedText>
                      </View>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('totalIncome', language)}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: theme.green }]}>
                          {currentRent > 0 ? formatCurrency(currentRent) + '/s' : '—'}
                        </ThemedText>
                      </View>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('ownedLabel', language)}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: theme.accent }]}>{r.count}</ThemedText>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: 6 }}>
                      <Pressable
                        disabled={!canBuy}
                        onPress={() => buyRealEstate(r.id)}
                        style={({ pressed }) => [
                          styles.buyBtn,
                          { flex: 1, backgroundColor: canBuy ? theme.green : theme.backgroundSelected, borderColor: canBuy ? theme.green : theme.border, opacity: pressed ? 0.8 : 1 },
                        ]}
                      >
                        <ThemedText style={[styles.buyBtnLabel, { color: canBuy ? '#fff' : theme.textSecondary }]}>
                          {t('acquire', language)}
                        </ThemedText>
                        <ThemedText style={[styles.buyBtnCost, { color: canBuy ? '#fff' : theme.textSecondary }]}>
                          {formatCurrency(r.cost)}
                        </ThemedText>
                      </Pressable>

                      {r.count > 0 && r.upgradeLevel < 5 && (
                        <Pressable
                          disabled={capital < r.upgradeCost}
                          onPress={() => upgradeProperty(r.id)}
                          style={({ pressed }) => [
                            styles.buyBtn,
                            { flex: 1, borderColor: capital >= r.upgradeCost ? theme.accent : theme.border, opacity: pressed ? 0.8 : 1 },
                          ]}
                        >
                          <ThemedText style={[styles.buyBtnLabel, { color: capital >= r.upgradeCost ? theme.text : theme.textSecondary }]}>
                            {t('upgradeBtnLabel', language)}
                          </ThemedText>
                          <ThemedText style={[styles.buyBtnCost, { color: capital >= r.upgradeCost ? theme.accent : theme.textSecondary }]}>
                            {formatCurrency(r.upgradeCost)}
                          </ThemedText>
                        </Pressable>
                      )}
                    </View>
                  </View>
                </LedgerCard>
              );
            } else {
              // Luxury assets (Cars, Planes, Jewelry)
              const l = item as typeof luxury[0];
              const accentColor = activeTab === 'jewelry' ? '#627EEA' : theme.accent;
              
              return (
                <LedgerCard
                  key={l.id}
                  title={l.name}
                  rightTitle={l.count > 0 ? `×${l.count}` : ''}
                  borderAccentColor={l.count > 0 ? accentColor : theme.textSecondary}
                >
                  <View style={styles.cardContent}>
                    {l.imageUrl && (
                      <SafeImage
                        uri={l.imageUrl}
                        fallback={
                          activeTab === 'car'
                            ? 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60'
                            : activeTab === 'plane'
                            ? 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=500&auto=format&fit=crop&q=60'
                            : 'https://images.unsplash.com/photo-1610375228911-c4ab02318010?w=500&auto=format&fit=crop&q=60'
                        }
                        style={styles.assetImage}
                      />
                    )}

                    <View style={styles.statsRow}>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('prestige', language).toUpperCase()}</ThemedText>
                        <View style={styles.prestigeRow}>
                          <Award size={12} color={accentColor} />
                          <ThemedText style={[styles.statValue, { color: accentColor, marginLeft: 3 }]}>
                            +{l.prestige.toLocaleString()}
                          </ThemedText>
                        </View>
                      </View>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('ownedLabel', language)}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: accentColor }]}>{l.count}</ThemedText>
                      </View>
                      <View style={[styles.statBox, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
                        <ThemedText style={styles.statLabel}>{t('effectLabel', language)}</ThemedText>
                        <ThemedText style={[styles.statValue, { color: theme.textSecondary, fontSize: 9 }]}>
                          +{t('prestige', language)}
                        </ThemedText>
                      </View>
                    </View>

                    <Pressable
                      disabled={!canBuy}
                      onPress={() => buyLuxury(l.id)}
                      style={({ pressed }) => [
                        styles.buyBtn,
                        { backgroundColor: canBuy ? accentColor : theme.backgroundSelected, borderColor: canBuy ? accentColor : theme.border, opacity: pressed ? 0.8 : 1 },
                      ]}
                    >
                      <Sparkles size={14} color={canBuy ? '#fff' : theme.textSecondary} />
                      <ThemedText style={[styles.buyBtnLabel, { color: canBuy ? '#fff' : theme.textSecondary }]}>
                        {t('purchaseAsset', language)}
                      </ThemedText>
                      <ThemedText style={[styles.buyBtnCost, { color: canBuy ? '#fff' : theme.textSecondary }]}>
                        {formatCurrency(l.cost)}
                      </ThemedText>
                    </Pressable>
                  </View>
                </LedgerCard>
              );
            }
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBand: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1 },
  headerItem: { flex: 1, alignItems: 'center' },
  headerLabel: { fontSize: 9, letterSpacing: 1.5, fontWeight: '700', color: '#9CA3AF', marginBottom: 2 },
  headerValue: { fontSize: 13, fontWeight: '800' },
  headerDivider: { width: 1, height: 32, alignSelf: 'center' },
  
  tabScroll: { borderBottomWidth: 0.5 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabBtnActive: {},
  tabLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  
  filterBar: { paddingVertical: 8 },
  filterScroll: { paddingHorizontal: 12, gap: 6 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  filterChipActive: { borderWidth: 1 },
  filterChipText: { fontSize: 10, fontWeight: '700' },
  
  listContainer: { paddingHorizontal: 12, paddingTop: 4, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  
  cardContent: { flexDirection: 'column', marginTop: 4 },
  assetImage: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  upgradeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10, paddingHorizontal: 4 },
  levelPip: { width: 14, height: 6, borderRadius: 3, borderWidth: 1 },
  statsRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  statBox: { flex: 1, borderRadius: 8, borderWidth: 1, padding: 8, alignItems: 'center' },
  statLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 0.8, color: '#9CA3AF', marginBottom: 3 },
  statValue: { fontSize: 12, fontWeight: '800' },
  prestigeRow: { flexDirection: 'row', alignItems: 'center' },
  
  buyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 42, borderRadius: 8, borderWidth: 1, paddingHorizontal: 14, gap: 6 },
  buyBtnLabel: { fontSize: 12, fontWeight: '800' },
  buyBtnCost: { fontSize: 12, fontWeight: '800' },
});
