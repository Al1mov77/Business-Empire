import React, { useState } from 'react';
import {
  StyleSheet, View, ScrollView, Pressable, TextInput, Alert, Image,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { LedgerCard } from '@/components/LedgerCard';
import { useGameStore, Business, ROLE_LABELS, generateCandidate } from '@/store/gameStore';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  ShoppingBag, Truck, Hammer, Cpu, Landmark, UserPlus, Sparkles,
  ChevronUp, Users, X, Star, Flame, Plane, Trophy, Globe,
  Building2, Shirt, Rocket, Car, TrendingUp, AlertCircle, Trash2,
  Film, Droplets, Zap, ChevronRight, ArrowLeft, Play, RotateCw,
  FlaskConical, Cloud, Brain, Compass, Atom
} from 'lucide-react-native';

const CATEGORY_COLORS: Record<string, string> = {
  Commerce: '#10B981',    // Emerald
  Transport: '#8B5CF6',   // Violet
  Heavy: '#F59E0B',       // Amber
  Construction: '#EF4444', // Red
  Automotive: '#3B82F6',  // Blue
  Technology: '#06B6D4',  // Cyan
  Finance: '#6366F1',     // Indigo
  Aviation: '#0EA5E9',    // Sky
  Aerospace: '#A855F7',   // Purple
  Conglomerate: '#14B8A6', // Teal
};

function getBusinessIcon(id: string, color: string, size = 22): React.ReactElement {
  const iconMap: Record<string, React.ReactElement> = {
    car_wash: <Droplets size={size} color={color} />,
    retail: <ShoppingBag size={size} color={color} />,
    taxi: <Car size={size} color={color} />,
    logistics: <Truck size={size} color={color} />,
    cinema: <Film size={size} color={color} />,
    factory: <Hammer size={size} color={color} />,
    construction: <Building2 size={size} color={color} />,
    car_dealership: <Car size={size} color={color} />,
    it_company: <Cpu size={size} color={color} />,
    bank: <Landmark size={size} color={color} />,
    football_club: <Trophy size={size} color={color} />,
    clothing_brand: <Shirt size={size} color={color} />,
    airlines: <Plane size={size} color={color} />,
    oil_gas: <Flame size={size} color={color} />,
    space_agency: <Rocket size={size} color={color} />,
    holding: <Globe size={size} color={color} />,
  };
  return iconMap[id] ?? <ShoppingBag size={size} color={color} />;
}

// ─── Component ──────────────────────────────────────────
export default function BusinessesScreen() {
  const theme = useTheme();
  const language = useGameStore((state) => state.language);
  const capital = useGameStore((state) => state.capital);
  const totalEarned = useGameStore((state) => state.totalEarned);
  const businesses = useGameStore((state) => state.businesses);
  const buyBusiness = useGameStore((state) => state.buyBusiness);
  const sellBusiness = useGameStore((state) => state.sellBusiness);
  const renameBusiness = useGameStore((state) => state.renameBusiness);
  const hireManager = useGameStore((state) => state.hireManager);
  const upgradeBusiness = useGameStore((state) => state.upgradeBusiness);
  const hireEmployee = useGameStore((state) => state.hireEmployee);
  const fireEmployee = useGameStore((state) => state.fireEmployee);
  const mergeBusinesses = useGameStore((state) => state.mergeBusinesses);

  // Mini games actions & states
  const setBankRates = useGameStore((state) => state.setBankRates);
  const flippedCars = useGameStore((state) => state.flippedCars);
  const buyCarForFlipping = useGameStore((state) => state.buyCarForFlipping);
  const repairCar = useGameStore((state) => state.repairCar);
  const sellFlippedCar = useGameStore((state) => state.sellFlippedCar);
  const itProjects = useGameStore((state) => state.itProjects);
  const startITProject = useGameStore((state) => state.startITProject);
  const skyscraperProjects = useGameStore((state) => state.skyscraperProjects);
  const startSkyscraper = useGameStore((state) => state.startSkyscraper);
  
  const washCarManually = useGameStore((state) => state.washCarManually);
  const upgradeCarWashSoap = useGameStore((state) => state.upgradeCarWashSoap);
  const carWashManualUpgrade = useGameStore((state) => state.carWashManualUpgrade);
  const cinemaMovieActive = useGameStore((state) => state.cinemaMovieActive);
  const cinemaMovieProgress = useGameStore((state) => state.cinemaMovieProgress);
  const cinemaMovieDuration = useGameStore((state) => state.cinemaMovieDuration);
  const scheduleMovie = useGameStore((state) => state.scheduleMovie);
  const taxiFleet = useGameStore((state) => state.taxiFleet);
  const buyTaxiCar = useGameStore((state) => state.buyTaxiCar);
  const airlineRoutes = useGameStore((state) => state.airlineRoutes);
  const buyAirlineRoute = useGameStore((state) => state.buyAirlineRoute);
  const activeLoans = useGameStore((state) => state.activeLoans);
  const approveLoanRequest = useGameStore((state) => state.approveLoanRequest);
  const itCompanyIPO_Launched = useGameStore((state) => state.itCompanyIPO_Launched);
  const launchITIPO = useGameStore((state) => state.launchITIPO);

  // New Interactive states and actions
  const fcPlayers = useGameStore((state) => state.fcPlayers);
  const fcTrainingLevel = useGameStore((state) => state.fcTrainingLevel);
  const fcMatchActive = useGameStore((state) => state.fcMatchActive);
  const fcMatchTimer = useGameStore((state) => state.fcMatchTimer);
  const fcOpponentRating = useGameStore((state) => state.fcOpponentRating);
  const fcMatchLog = useGameStore((state) => state.fcMatchLog);
  const recruitFootballPlayer = useGameStore((state) => state.recruitFootballPlayer);
  const trainFootballSquad = useGameStore((state) => state.trainFootballSquad);
  const startFootballMatch = useGameStore((state) => state.startFootballMatch);

  const clothingCollectionActive = useGameStore((state) => state.clothingCollectionActive);
  const clothingCollectionName = useGameStore((state) => state.clothingCollectionName);
  const clothingCollectionProgress = useGameStore((state) => state.clothingCollectionProgress);
  const clothingCollectionDuration = useGameStore((state) => state.clothingCollectionDuration);
  const clothingCollectionQuality = useGameStore((state) => state.clothingCollectionQuality);
  const startClothingCollection = useGameStore((state) => state.startClothingCollection);

  const oilWellsCount = useGameStore((state) => state.oilWellsCount);
  const oilPrice = useGameStore((state) => state.oilPrice);
  const oilReserve = useGameStore((state) => state.oilReserve);
  const drillOilWell = useGameStore((state) => state.drillOilWell);
  const sellOilReserves = useGameStore((state) => state.sellOilReserves);

  const spaceMissionActive = useGameStore((state) => state.spaceMissionActive);
  const spaceMissionDestination = useGameStore((state) => state.spaceMissionDestination);
  const spaceMissionProgress = useGameStore((state) => state.spaceMissionProgress);
  const spaceMissionDuration = useGameStore((state) => state.spaceMissionDuration);
  const spaceMissionSuccessRate = useGameStore((state) => state.spaceMissionSuccessRate);
  const spaceMissionLog = useGameStore((state) => state.spaceMissionLog);
  const launchSpaceMission = useGameStore((state) => state.launchSpaceMission);

  // Speed-ups and R&D upgrades
  const buyRDUpgrade = useGameStore((state) => state.buyRDUpgrade);
  const rdUpgrades = useGameStore((state) => state.rdUpgrades || {});
  const speedUpITProject = useGameStore((state) => state.speedUpITProject);
  const speedUpSkyscraper = useGameStore((state) => state.speedUpSkyscraper);
  const speedUpCinemaScreening = useGameStore((state) => state.speedUpCinemaScreening);
  const speedUpCarRepair = useGameStore((state) => state.speedUpCarRepair);

  // Routing Views state
  const [activeView, setActiveView] = useState<'list' | 'naming' | 'details'>('list');
  const [listTab, setListTab] = useState<'enterprises' | 'rd'>('enterprises');
  const [selectedBizId, setSelectedBizId] = useState<string | null>(null);
  const [namingInput, setNamingInput] = useState('');
  const [detailsTab, setDetailsTab] = useState<'revenue' | 'workforce' | 'projects' | 'management'>('revenue');
  const [clothingNameInput, setClothingNameInput] = useState('');

  // Generic custom production loop state
  const [productionTimers, setProductionTimers] = useState<Record<string, { active: boolean; progress: number }>>({});

  const selectedBiz = selectedBizId ? businesses.find(b => b.id === selectedBizId) ?? null : null;
  const activeSlots = businesses.filter(b => b.count > 0).length;
  const visibleBusinesses = businesses.filter(b => b.count > 0 || totalEarned >= b.unlockAt * 0.35 || b.unlockAt === 0);

  // Financial selector
  const getFinancialStats = (b: Business) => {
    const managerMult = b.managerHired ? 2.0 : 1.0;
    const staffBonus = b.employees.reduce((s, e) => s + e.skill / 100, 0);
    const salaryCost = b.employees.reduce((s, e) => s + e.salary, 0);

    let grossIncome = b.count * b.income * managerMult * (1 + staffBonus);
    if (b.id === 'bank') {
      const depositRate = b.depositRate ?? 1.0;
      const loanRate = b.loanRate ?? 1.0;
      const vaultFund = b.bankVaultFund ?? 0;
      const grossEarn = vaultFund * (loanRate * 0.00002) * b.count;
      const costPay = vaultFund * (depositRate * 0.000015) * b.count;
      grossIncome = Math.min(277778, grossEarn - costPay);
    } else if (b.id === 'holding') {
      grossIncome = b.count * 2416666 * b.level;
    } else if (b.id === 'space_agency') {
      grossIncome = b.count * 150000000 * b.level;
    } else if (b.id === 'oil_gas') {
      grossIncome = b.count * 28000000 * b.level;
    }

    const netProfit = grossIncome - salaryCost;
    return { grossIncome, salaryCost, netProfit, staffBonus };
  };

  const currentBizStats = selectedBiz ? getFinancialStats(selectedBiz) : null;

  // Active production loop trigger
  const runActiveProduction = (id: string, income: number) => {
    if (productionTimers[id]?.active) return;
    setProductionTimers(prev => ({ ...prev, [id]: { active: true, progress: 0 } }));
    
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProductionTimers(prev => ({
        ...prev,
        [id]: { active: true, progress: current }
      }));

      if (current >= 100) {
        clearInterval(interval);
        setProductionTimers(prev => ({ ...prev, [id]: { active: false, progress: 0 } }));
        // Award 5x passive yield instantly
        useGameStore.setState(state => {
          const reward = income * 5;
          return {
            capital: state.capital + reward,
            totalEarned: state.totalEarned + reward
          };
        });
      }
    }, 200);
  };

  // Naming confirmation handler
  const handleLaunchCompany = () => {
    if (!selectedBizId) return;
    const finalName = namingInput.trim() || selectedBiz?.name || 'My Corporation';
    buyBusiness(selectedBizId);
    renameBusiness(selectedBizId, finalName);
    setActiveView('details');
    setDetailsTab('revenue');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {activeView === 'list' && (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header Stats */}
          <View style={[styles.headerBand, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
            <View style={styles.headerItem}>
              <ThemedText style={styles.headerLabel}>{language === 'ru' ? 'КАПИТАЛ' : 'CAPITAL'}</ThemedText>
              <ThemedText style={[styles.headerValue, { color: theme.accent }]}>{formatCurrency(capital)}</ThemedText>
            </View>
            <View style={[styles.headerDivider, { backgroundColor: theme.border }]} />
            <View style={styles.headerItem}>
              <ThemedText style={styles.headerLabel}>{language === 'ru' ? 'ПРЕДПРИЯТИЯ' : 'SLOTS'}</ThemedText>
              <ThemedText style={[styles.headerValue, { color: theme.accent }]}>{activeSlots}/6</ThemedText>
            </View>
          </View>

          {/* Segment Toggle */}
          <View style={{ paddingHorizontal: 12, marginTop: 10 }}>
            <View style={[styles.segmentedContainer, { backgroundColor: theme.backgroundElement, borderRadius: 8, padding: 3, flexDirection: 'row', gap: 4 }]}>
              <Pressable
                onPress={() => setListTab('enterprises')}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    height: 38,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: listTab === 'enterprises' ? theme.accent : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <ThemedText style={{ fontSize: 11.5, fontWeight: '800', color: listTab === 'enterprises' ? '#000' : theme.textSecondary }}>
                  💼 {language === 'ru' ? 'ПРЕДПРИЯТИЯ' : 'ENTERPRISES'}
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={() => setListTab('rd')}
                style={({ pressed }) => [
                  {
                    flex: 1,
                    height: 38,
                    borderRadius: 6,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: listTab === 'rd' ? theme.accent : 'transparent',
                    opacity: pressed ? 0.8 : 1,
                  }
                ]}
              >
                <ThemedText style={{ fontSize: 11.5, fontWeight: '800', color: listTab === 'rd' ? '#000' : theme.textSecondary }}>
                  🔬 {language === 'ru' ? 'ЛАБОРАТОРИЯ R&D' : 'R&D TECH LAB'}
                </ThemedText>
              </Pressable>
            </View>
          </View>

          {listTab === 'enterprises' && (
            <>
              {/* Mergers Board */}
              <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
                <LedgerCard title={language === 'ru' ? 'Слияния Корпораций' : 'Corporate Mergers'} subtitle={language === 'ru' ? 'Объединяйте бизнесы для освобождения слотов' : 'Merge companies to free slots & raise limits'} borderAccentColor={theme.accent}>
              <View style={{ gap: 10, marginTop: 6 }}>
                <View style={styles.mergeRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: '800', fontSize: 13, color: theme.accent }}>{language === 'ru' ? 'Глобальный Холдинг' : 'Holding Company'}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{language === 'ru' ? 'Доход $2.4 млн/сек. Персонал не требуется.' : 'Yields $2.4M/s base. No staff needed.'}</ThemedText>
                    <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>Requires: Bank (LVL 10), Retail (LVL 10), Factory (LVL 10)</ThemedText>
                  </View>
                  <Pressable onPress={() => mergeBusinesses('holding')} style={[styles.mergeBtn, { borderColor: theme.accent }]}>
                    <ThemedText style={{ color: theme.accent, fontSize: 11, fontWeight: '700' }}>MERGE</ThemedText>
                  </Pressable>
                </View>
                <View style={styles.mergeRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={{ fontWeight: '800', fontSize: 13, color: '#A855F7' }}>{language === 'ru' ? 'Космическое Агентство' : 'Space Agency'}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{language === 'ru' ? 'Доход $150 млн/сек. Космические контракты.' : 'Yields $150M/s base. High-tech orbit contracts.'}</ThemedText>
                    <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>Requires: IT Company (LVL 10), Factory (LVL 10)</ThemedText>
                  </View>
                  <Pressable onPress={() => mergeBusinesses('hitech')} style={[styles.mergeBtn, { borderColor: '#A855F7' }]}>
                    <ThemedText style={{ color: '#A855F7', fontSize: 11, fontWeight: '700' }}>MERGE</ThemedText>
                  </Pressable>
                </View>
              </View>
            </LedgerCard>
          </View>

          {/* Businesses List */}
          <View style={styles.listContainer}>
            {visibleBusinesses.map((b) => {
              const catColor = CATEGORY_COLORS[b.category] ?? theme.accent;
              const isOwned = b.count > 0;
              const canAcquire = capital >= b.cost && activeSlots < 6;

              return (
                <LedgerCard
                  key={b.id}
                  title={isOwned ? (b.customName || b.name) : b.name}
                  rightTitle={isOwned ? `LVL ${b.level}` : ''}
                  borderAccentColor={isOwned ? catColor : theme.textSecondary}
                >
                  <View style={styles.listItemContent}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <ThemedText type="small" themeColor="textSecondary" style={{ marginBottom: 4 }}>
                        {b.description}
                      </ThemedText>
                      {isOwned ? (
                        <ThemedText style={{ fontSize: 11, color: theme.green, fontWeight: '700' }}>
                          {language === 'ru' ? `Доходность: ${formatCurrency(getFinancialStats(b).netProfit)}/сек` : `Yield: ${formatCurrency(getFinancialStats(b).netProfit)}/s`}
                        </ThemedText>
                      ) : (
                        <ThemedText style={{ fontSize: 11, color: theme.accent, fontWeight: '700' }}>
                          {language === 'ru' ? `Стоимость запуска: ${formatCurrency(b.cost)}` : `Startup Fee: ${formatCurrency(b.cost)}`}
                        </ThemedText>
                      )}
                    </View>

                    {isOwned ? (
                      <Pressable
                        onPress={() => {
                          setSelectedBizId(b.id);
                          setActiveView('details');
                          setDetailsTab('revenue');
                        }}
                        style={[styles.actionBtn, { borderColor: catColor }]}
                      >
                        <ThemedText style={{ color: catColor, fontSize: 10, fontWeight: '800' }}>
                          {language === 'ru' ? 'УПРАВЛЯТЬ' : 'MANAGE'}
                        </ThemedText>
                      </Pressable>
                    ) : (
                      <Pressable
                        disabled={!canAcquire}
                        onPress={() => {
                          setSelectedBizId(b.id);
                          setNamingInput('');
                          setActiveView('naming');
                        }}
                        style={[styles.actionBtn, { backgroundColor: canAcquire ? theme.accent : theme.backgroundSelected, borderColor: canAcquire ? theme.accent : theme.border }]}
                      >
                        <ThemedText style={{ color: canAcquire ? '#fff' : theme.textSecondary, fontSize: 10, fontWeight: '800' }}>
                          {language === 'ru' ? 'СОЗДАТЬ' : 'ACQUIRE'}
                        </ThemedText>
                      </Pressable>
                    )}
                  </View>
                </LedgerCard>
              );
            })}
          </View>
          </>
          )}

          {listTab === 'rd' && (
            <View style={{ paddingHorizontal: 12, marginTop: 10, gap: 12, paddingBottom: 40 }}>
              <LedgerCard 
                title={language === 'ru' ? 'R&D Отдел Исследований' : 'R&D Technology Laboratory'} 
                subtitle={language === 'ru' ? 'Инвестируйте в глобальные научные улучшения для максимизации прибыли' : 'Invest in advanced technology to enhance sector yields'}
                borderAccentColor={theme.accent}
              >
                <View style={{ gap: 10, marginTop: 6 }}>
                  {[
                    {
                      id: 'rd_cloud_integration',
                      title: language === 'ru' ? 'Облачная Интеграция' : 'Cloud Integration',
                      desc: language === 'ru' ? 'Оптимизация логистики поставок. Дает +25% к прибыли Торговых сетей пассивно.' : 'Optimizes supply logistics. Adds +25% to Commerce Retail yields passively.',
                      cost: 8500000,
                      icon: <Cloud size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_ai_automation',
                      title: language === 'ru' ? 'ИИ-Автоматизация' : 'AI Automation Systems',
                      desc: language === 'ru' ? 'Автоматическая оптимизация процессов. Дает +30% к прибыли Заводов и Автомоек.' : 'Autonomous workflow management. Adds +30% to Factory and Car Wash yields.',
                      cost: 35000000,
                      icon: <Brain size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_clean_energy',
                      title: language === 'ru' ? 'Экологически Чистое Топливо' : 'Clean Energy Tech',
                      desc: language === 'ru' ? 'Перевод флота на водород. Дает +25% к прибыли Таксопарков и Авиамаршрутов.' : 'Transition fleet to green hydrogen. Adds +25% to Taxi & Airline routes yields.',
                      cost: 140000000,
                      icon: <Zap size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_neural_dial',
                      title: language === 'ru' ? 'Нейро-Кликер Модуль' : 'Neural Tapping Dial',
                      desc: language === 'ru' ? 'Интерфейс «мозг-компьютер». Удваивает постоянную силу клика.' : 'Neural matrix tap synchronizer. Permanently doubles vault tapping yields.',
                      cost: 450000000,
                      icon: <Compass size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_hft_algorithms',
                      title: language === 'ru' ? 'Высокочастотные Алгоритмы (HFT)' : 'HFT Algorithmic Core',
                      desc: language === 'ru' ? 'Количественная аналитика сделок. Дает +30% к доходам от кредитов в Банках.' : 'Quantitative latency micro-arbitrage. Adds +30% profit to active bank loans.',
                      cost: 1200000000,
                      icon: <TrendingUp size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_quantum_sensor',
                      title: language === 'ru' ? 'Квантовые Сенсоры Добычи' : 'Quantum Soil Sensors',
                      desc: language === 'ru' ? 'Сканирование залежей. Дает +40% к темпу добычи Нефти и Газа.' : 'Deep sub-surface geological mapping. Adds +40% speed to Oil & Gas extraction.',
                      cost: 4500000000,
                      icon: <Cpu size={18} color={theme.accent} />,
                    },
                    {
                      id: 'rd_fusion_propulsion',
                      title: language === 'ru' ? 'Термоядерные Двигатели' : 'Fusion Rocket Propulsion',
                      desc: language === 'ru' ? 'Сокращение времени полетов. Дает +50% к наградам за Космические миссии.' : 'Advanced plasma propulsion thrust. Adds +50% payout to successful space missions.',
                      cost: 15000000000,
                      icon: <Atom size={18} color={theme.accent} />,
                    },
                  ].map((tech) => {
                    const purchased = rdUpgrades[tech.id];
                    const canAfford = capital >= tech.cost;

                    return (
                      <View key={tech.id} style={[styles.subWidgetRow, { paddingVertical: 10, borderBottomWidth: 0.5, borderBottomColor: theme.border }]}>
                        <View style={{ marginRight: 10, padding: 6, borderRadius: 8, backgroundColor: theme.backgroundElement }}>
                          {tech.icon}
                        </View>
                        <View style={{ flex: 1, marginRight: 8 }}>
                          <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{tech.title}</ThemedText>
                          <ThemedText style={{ fontSize: 9, color: theme.textSecondary, marginTop: 2 }}>{tech.desc}</ThemedText>
                          {!purchased && (
                            <ThemedText style={{ fontSize: 9, color: theme.accent, fontWeight: '700', marginTop: 4 }}>
                              {language === 'ru' ? 'Стоимость: ' : 'Research Cost: '}{formatCurrency(tech.cost)}
                            </ThemedText>
                          )}
                        </View>
                        
                        <Pressable
                          disabled={purchased || !canAfford}
                          onPress={() => buyRDUpgrade(tech.id)}
                          style={({ pressed }) => [
                            styles.subWidgetAction,
                            {
                              borderColor: purchased ? theme.green : (canAfford ? theme.accent : theme.border),
                              backgroundColor: purchased ? theme.green + '15' : 'transparent',
                              opacity: pressed ? 0.8 : 1,
                            }
                          ]}
                        >
                          <ThemedText style={{ fontSize: 8.5, fontWeight: '800', color: purchased ? theme.green : (canAfford ? theme.accent : theme.textSecondary) }}>
                            {purchased ? '✓ ACTIVE' : (language === 'ru' ? 'ИЗУЧИТЬ' : 'RESEARCH')}
                          </ThemedText>
                        </Pressable>
                      </View>
                    );
                  })}
                </View>
              </LedgerCard>
            </View>
          )}
        </ScrollView>
      )}

      {/* ─── Company Naming Page ─── */}
      {activeView === 'naming' && selectedBiz && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, backgroundColor: theme.background }}
        >
          <View style={{ height: 60, paddingHorizontal: 20, justifyContent: 'center', paddingTop: 10 }}>
            <Pressable onPress={() => setActiveView('list')} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
              <ArrowLeft size={16} color={theme.text} />
              <ThemedText style={{ marginLeft: 6, fontWeight: '700' }}>{language === 'ru' ? 'ОТМЕНА' : 'CANCEL'}</ThemedText>
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.namingCard}>
              <ThemedText style={[styles.namingTitle, { color: theme.accent }]}>
                {language === 'ru' ? 'ОСНОВАНИЕ КОРПОРАЦИИ' : 'LAUNCH NEW ENTERPRISE'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', marginBottom: 20 }}>
                {language === 'ru' 
                  ? `Вы собираетесь запустить предприятие в сфере "${selectedBiz.category}". Установите его юридическое название.`
                  : `You are about to launch a new corporate sector under "${selectedBiz.category}". Set its legal corporate identifier.`}
              </ThemedText>

              <TextInput
                value={namingInput}
                onChangeText={setNamingInput}
                placeholder={language === 'ru' ? 'Например: Умар Логистик Груп' : 'E.g. Apex Global Industries'}
                placeholderTextColor={theme.textSecondary}
                style={[styles.namingInput, { borderColor: theme.accent, color: theme.text }]}
                autoFocus
              />

              <Pressable
                onPress={handleLaunchCompany}
                style={({ pressed }) => [
                  styles.namingSubmit,
                  { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 }
                ]}
              >
                <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
                  {language === 'ru' 
                    ? `ОПЛАТИТЬ ЗАПУСК: ${formatCurrency(selectedBiz.cost)}` 
                    : `CONFIRM LAUNCH: ${formatCurrency(selectedBiz.cost)}`}
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ─── Business Dedicated Sub-pages ─── */}
      {activeView === 'details' && selectedBiz && currentBizStats && (
        <View style={{ flex: 1 }}>
          {/* Header row */}
          <View style={[styles.detailsHeaderRow, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
            <Pressable onPress={() => setActiveView('list')} style={styles.detailsBackBtn}>
              <ArrowLeft size={16} color={theme.accent} />
              <ThemedText style={{ color: theme.accent, fontWeight: '800', fontSize: 11, marginLeft: 4 }}>
                {language === 'ru' ? 'ВСЕ БИЗНЕСЫ' : 'EMPIRE LEDGER'}
              </ThemedText>
            </Pressable>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText style={{ fontWeight: '800', fontSize: 14, color: theme.text }}>
                {selectedBiz.customName || selectedBiz.name}
              </ThemedText>
              <ThemedText style={{ fontSize: 9, color: CATEGORY_COLORS[selectedBiz.category] ?? theme.accent, fontWeight: '800' }}>
                {selectedBiz.category.toUpperCase()} // LVL {selectedBiz.level}
              </ThemedText>
            </View>
          </View>

          {/* Sub Tabs Selector */}
          <View style={[styles.subTabRow, { backgroundColor: theme.backgroundElement, borderBottomColor: theme.border }]}>
            {(['revenue', 'workforce', 'projects', 'management'] as const).map((tab) => {
              const active = detailsTab === tab;
              const tabLabels = {
                revenue: language === 'ru' ? 'ВЫРУЧКА' : 'REVENUE',
                workforce: language === 'ru' ? 'ШТАТ' : 'WORKFORCE',
                projects: language === 'ru' ? 'ПРОЕКТЫ' : 'PROJECTS',
                management: language === 'ru' ? 'УПРАВЛЕНИЕ' : 'MANAGE',
              };
              return (
                <Pressable
                  key={tab}
                  onPress={() => setDetailsTab(tab)}
                  style={[styles.subTabBtn, active && { borderBottomColor: theme.accent }]}
                >
                  <ThemedText
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    style={{ fontSize: 9.5, fontWeight: '800', color: active ? theme.accent : theme.textSecondary }}
                  >
                    {tabLabels[tab]}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>

          {/* Sub Tab Screen content */}
          <ScrollView contentContainerStyle={styles.detailsTabContainer} showsVerticalScrollIndicator={false}>
            {/* 1. REVENUE VIEW */}
            {detailsTab === 'revenue' && (
              <View style={{ gap: 12 }}>
                <LedgerCard title={language === 'ru' ? 'Развитие Фирмы' : 'Corporate Upgrades'} borderAccentColor={theme.accent}>
                  <View style={{ gap: 8, marginTop: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <ThemedText style={{ fontWeight: '700', fontSize: 12 }}>{language === 'ru' ? `Уровень компании: ${selectedBiz.level}/10` : `Firm Upgrade Tier: ${selectedBiz.level}/10`}</ThemedText>
                        <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>{language === 'ru' ? '+25% к базовому доходу за уровень' : '+25% passive yields multiplier per level'}</ThemedText>
                      </View>
                      <Pressable
                        disabled={capital < selectedBiz.upgradeCost || selectedBiz.level >= 10}
                        onPress={() => upgradeBusiness(selectedBiz.id)}
                        style={({ pressed }) => [
                          styles.upgradeBtnAction,
                          { 
                            borderColor: capital >= selectedBiz.upgradeCost && selectedBiz.level < 10 ? theme.green : theme.border,
                            opacity: pressed ? 0.8 : 1
                          }
                        ]}
                      >
                        <ThemedText style={{ fontSize: 10, fontWeight: '800', color: capital >= selectedBiz.upgradeCost && selectedBiz.level < 10 ? theme.green : theme.textSecondary }}>
                          {selectedBiz.level >= 10 ? 'MAX' : `${language === 'ru' ? 'ПРОКАЧАТЬ' : 'UPGRADE'} (${formatCurrency(selectedBiz.upgradeCost)})`}
                        </ThemedText>
                      </Pressable>
                    </View>

                    <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 6 }} />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 1, marginRight: 12 }}>
                        <ThemedText style={{ fontWeight: '700', fontSize: 12 }}>{language === 'ru' ? 'Генеральный Управляющий' : 'Automated Operations Manager'}</ThemedText>
                        <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>{language === 'ru' ? 'Автоматически удваивает прибыль бизнеса' : 'Doubles overall income passive yield bonus'}</ThemedText>
                      </View>
                      <Pressable
                        disabled={selectedBiz.managerHired || capital < selectedBiz.managerCost}
                        onPress={() => hireManager(selectedBiz.id)}
                        style={({ pressed }) => [
                          styles.upgradeBtnAction,
                          { 
                            borderColor: selectedBiz.managerHired ? theme.green : (capital >= selectedBiz.managerCost ? theme.accent : theme.border),
                            backgroundColor: selectedBiz.managerHired ? theme.green + '20' : 'transparent',
                            opacity: pressed ? 0.8 : 1
                          }
                        ]}
                      >
                        <ThemedText style={{ fontSize: 10, fontWeight: '800', color: selectedBiz.managerHired ? theme.green : (capital >= selectedBiz.managerCost ? theme.accent : theme.textSecondary) }}>
                          {selectedBiz.managerHired ? '✓ ACTIVE' : `${language === 'ru' ? 'НАЙТИ' : 'HIRE'} (${formatCurrency(selectedBiz.managerCost)})`}
                        </ThemedText>
                      </Pressable>
                    </View>
                  </View>
                </LedgerCard>

                <LedgerCard title={language === 'ru' ? 'Финансовая Ведомость' : 'Operating Balance Sheet'}>
                  <View style={{ gap: 6, marginTop: 6 }}>
                    <View style={styles.sheetRow}>
                      <ThemedText type="small">{language === 'ru' ? 'Валовый доход' : 'Gross Yield'}</ThemedText>
                      <ThemedText style={{ color: theme.green, fontWeight: '700', fontSize: 12 }}>+{formatCurrency(currentBizStats.grossIncome)}/s</ThemedText>
                    </View>
                    <View style={styles.sheetRow}>
                      <ThemedText type="small">{language === 'ru' ? 'Множитель управляющего' : 'Operations Manager'}</ThemedText>
                      <ThemedText type="smallBold">{selectedBiz.managerHired ? 'x2.0' : 'x1.0'}</ThemedText>
                    </View>
                    <View style={styles.sheetRow}>
                      <ThemedText type="small">{language === 'ru' ? 'Бонус квалификации штата' : 'Staff Training Bonus'}</ThemedText>
                      <ThemedText type="smallBold">+{Math.round(currentBizStats.staffBonus * 100)}%</ThemedText>
                    </View>
                    <View style={styles.sheetRow}>
                      <ThemedText type="small">{language === 'ru' ? 'Расходы на зарплаты' : 'Employee Salaries'}</ThemedText>
                      <ThemedText style={{ color: theme.red, fontWeight: '700', fontSize: 12 }}>-{formatCurrency(currentBizStats.salaryCost)}/s</ThemedText>
                    </View>
                    <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 4 }} />
                    <View style={styles.sheetRow}>
                      <ThemedText style={{ fontWeight: '800' }}>{language === 'ru' ? 'Чистая Прибыль' : 'Net Operating Income'}</ThemedText>
                      <ThemedText style={{ color: currentBizStats.netProfit >= 0 ? theme.green : theme.red, fontWeight: '800', fontSize: 14 }}>
                        {formatCurrency(currentBizStats.netProfit)}/s
                      </ThemedText>
                    </View>
                  </View>
                </LedgerCard>
              </View>
            )}

            {/* 2. WORKFORCE VIEW */}
            {detailsTab === 'workforce' && (
              <View style={{ gap: 12 }}>
                <LedgerCard title={language === 'ru' ? 'Найм Персонала' : 'Recruitment & Staffing'} rightTitle={`${selectedBiz.employees.length}/${selectedBiz.maxEmployees}`}>
                  <View style={{ marginTop: 6 }}>
                    <ThemedText style={{ fontSize: 11, color: theme.textSecondary, marginBottom: 8 }}>
                      {language === 'ru' 
                        ? 'Нанимайте сотрудников, чтобы увеличить эффективность работы. Затраты на найм составляют 20 сек оклада.'
                        : 'Recruit employees to boost business operations. Hiring fee is equivalent to 20 seconds of salary.'}
                    </ThemedText>

                    <Pressable
                      disabled={selectedBiz.employees.length >= selectedBiz.maxEmployees}
                      onPress={() => {
                        const cost = selectedBiz.income * selectedBiz.count * 2.0 * 20; // estimate
                        if (capital < cost) {
                          Alert.alert(language === 'ru' ? 'Недостаточно денег' : 'Insufficient Capital');
                          return;
                        }
                        hireEmployee(selectedBiz.id);
                      }}
                      style={({ pressed }) => [
                        styles.recruitBtn,
                        { 
                          backgroundColor: selectedBiz.employees.length < selectedBiz.maxEmployees ? theme.accent : theme.backgroundSelected,
                          opacity: pressed ? 0.8 : 1
                        }
                      ]}
                    >
                      <UserPlus size={16} color="#fff" />
                      <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 12, marginLeft: 6 }}>
                        {language === 'ru' ? 'НАЙТИ И НАНЯТЬ СОТРУДНИКА' : 'RECRUIT RANDOM APPLICANT'}
                      </ThemedText>
                    </Pressable>
                  </View>
                </LedgerCard>

                {/* Hired Employees List */}
                <LedgerCard title={language === 'ru' ? 'Штатное расписание' : 'Active Employees'}>
                  <View style={{ gap: 8, marginTop: 6 }}>
                    {selectedBiz.employees.length === 0 ? (
                      <ThemedText type="small" themeColor="textSecondary" style={{ textAlign: 'center', paddingVertical: 12 }}>
                        {language === 'ru' ? 'Штат пуст. Нажмите кнопку выше для найма.' : 'No staff currently hired. Click recruit to staff.'}
                      </ThemedText>
                    ) : (
                      selectedBiz.employees.map((emp) => (
                        <View key={emp.id} style={styles.employeeCard}>
                          <View style={{ flex: 1 }}>
                            <ThemedText style={{ fontWeight: '800', fontSize: 12 }}>{emp.name}</ThemedText>
                            <ThemedText style={{ fontSize: 9, color: theme.accent, fontWeight: '700' }}>
                              {ROLE_LABELS[emp.role].toUpperCase()}
                            </ThemedText>
                            <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                              {language === 'ru' 
                                ? `Оклад: ${formatCurrency(emp.salary)}/сек · Навык: +${emp.skill}%`
                                : `Salary: ${formatCurrency(emp.salary)}/s · Skill: +${emp.skill}%`}
                            </ThemedText>
                          </View>
                          <Pressable
                            onPress={() => fireEmployee(selectedBiz.id, emp.id)}
                            style={styles.fireBtn}
                          >
                            <Trash2 size={13} color={theme.red} />
                          </Pressable>
                        </View>
                      ))
                    )}
                  </View>
                </LedgerCard>
              </View>
            )}

            {/* 3. PROJECTS VIEW (INTERACTIVE WIDGETS) */}
            {detailsTab === 'projects' && (
              <View style={{ gap: 12 }}>
                {/* 🚗 CAR WASH PANEL */}
                {selectedBiz.id === 'car_wash' && (
                  <LedgerCard title={language === 'ru' ? 'Управление Автомойкой' : 'Car Wash Active Bay'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {language === 'ru' ? 'Кликайте на автомойку, чтобы мыть машины вручную и мгновенно зарабатывать наличные!' : 'Wash cars manually by active tapping to earn immediate liquid capital.'}
                      </ThemedText>
                      <View style={{ flexDirection: 'row', gap: 6, marginVertical: 6 }}>
                        <Pressable
                          onPress={washCarManually}
                          style={({ pressed }) => [
                            styles.clickActiveBtn,
                            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1 }
                          ]}
                        >
                          <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 13 }}>
                            💦 {language === 'ru' ? 'ПОМЫТЬ МАШИНУ' : 'WASH CAR'} (+${15 * carWashManualUpgrade})
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          disabled={capital < Math.round(150 * Math.pow(2.2, carWashManualUpgrade))}
                          onPress={upgradeCarWashSoap}
                          style={({ pressed }) => [
                            styles.clickActiveUpgrade,
                            { 
                              borderColor: capital >= Math.round(150 * Math.pow(2.2, carWashManualUpgrade)) ? theme.green : theme.border,
                              opacity: pressed ? 0.8 : 1 
                            }
                          ]}
                        >
                          <ThemedText style={{ fontSize: 9, fontWeight: '700', color: capital >= Math.round(150 * Math.pow(2.2, carWashManualUpgrade)) ? theme.green : theme.textSecondary, textAlign: 'center' }}>
                            🧼 {language === 'ru' ? 'КУПИТЬ ШАМПУНЬ' : 'UPGRADE SOAP'}{'\n'}Lvl {carWashManualUpgrade} ({formatCurrency(Math.round(150 * Math.pow(2.2, carWashManualUpgrade)))})
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </LedgerCard>
                )}

                {/* 🚕 TAXI FLEET PANEL */}
                {selectedBiz.id === 'taxi' && (
                  <LedgerCard title={language === 'ru' ? 'Управление Таксопарком' : 'Taxi Cars Purchase'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {[
                        { type: 'economy', name: language === 'ru' ? 'Эконом Класс' : 'Economy Sedan', cost: 3000, yieldVal: 2 },
                        { type: 'comfort', name: language === 'ru' ? 'Комфорт Класс' : 'Comfort Sedan', cost: 12000, yieldVal: 8 },
                        { type: 'business', name: language === 'ru' ? 'Бизнес Класс' : 'Business Luxury', cost: 45000, yieldVal: 25 },
                      ].map(car => {
                        const count = taxiFleet ? (taxiFleet[car.type as 'economy' | 'comfort' | 'business'] || 0) : 0;
                        const canBuy = capital >= car.cost;
                        return (
                          <View key={car.type} style={styles.subWidgetRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={{ fontWeight: '700', fontSize: 12 }}>{car.name} (×{count})</ThemedText>
                              <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                                {language === 'ru' ? `Цена: ${formatCurrency(car.cost)} · Доход: +${formatCurrency(car.yieldVal)}/сек` : `Cost: ${formatCurrency(car.cost)} · Yield: +${formatCurrency(car.yieldVal)}/s`}
                              </ThemedText>
                            </View>
                            <Pressable
                              disabled={!canBuy}
                              onPress={() => buyTaxiCar(car.type as any, car.cost)}
                              style={[styles.subWidgetAction, { borderColor: canBuy ? theme.accent : theme.border }]}
                            >
                              <ThemedText style={{ color: canBuy ? theme.accent : theme.textSecondary, fontSize: 10, fontWeight: '700' }}>
                                {language === 'ru' ? 'КУПИТЬ' : 'BUY'}
                              </ThemedText>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}

                {/* 🎬 CINEMA THEATER PANEL */}
                {selectedBiz.id === 'cinema' && (
                  <LedgerCard title={language === 'ru' ? 'Показ Кинолент' : 'Cinema Theater Operations'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {cinemaMovieActive ? (
                        <View style={{ marginVertical: 6 }}>
                          <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>🎬 {cinemaMovieActive}</ThemedText>
                          <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 6, height: 6 }]}>
                            <View style={[styles.progressFill, { width: `${(cinemaMovieProgress / cinemaMovieDuration) * 100}%`, backgroundColor: theme.accent }]} />
                          </View>
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                            <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                              {language === 'ru' ? `До окончания: ${Math.round(cinemaMovieDuration - cinemaMovieProgress)}с` : `Completes in ${Math.round(cinemaMovieDuration - cinemaMovieProgress)}s`}
                            </ThemedText>
                            <Pressable
                              disabled={capital < Math.round((cinemaMovieDuration - cinemaMovieProgress) * 125)}
                              onPress={speedUpCinemaScreening}
                              style={({ pressed }) => [
                                {
                                  paddingHorizontal: 8,
                                  paddingVertical: 4,
                                  borderRadius: 4,
                                  borderWidth: 1,
                                  borderColor: capital >= Math.round((cinemaMovieDuration - cinemaMovieProgress) * 125) ? theme.green : theme.border,
                                  backgroundColor: capital >= Math.round((cinemaMovieDuration - cinemaMovieProgress) * 125) ? theme.green + '15' : 'transparent',
                                  opacity: pressed ? 0.7 : 1,
                                }
                              ]}
                            >
                              <ThemedText style={{ fontSize: 8, fontWeight: '800', color: capital >= Math.round((cinemaMovieDuration - cinemaMovieProgress) * 125) ? theme.green : theme.textSecondary }}>
                                ⚡ {language === 'ru' ? 'УСКОРИТЬ' : 'SPEED UP'} ({formatCurrency(Math.round((cinemaMovieDuration - cinemaMovieProgress) * 125))})
                              </ThemedText>
                            </Pressable>
                          </View>
                        </View>
                      ) : (
                        <View style={{ gap: 6 }}>
                          {[
                            { title: language === 'ru' ? 'Комедийный Хит' : 'Comedy Special', dur: 15, cost: 800 },
                            { title: language === 'ru' ? 'Научная Фантастика' : 'Sci-Fi Blockbuster', dur: 45, cost: 3500 },
                            { title: language === 'ru' ? 'Эпическая Драма' : 'Superhit Franchise', dur: 120, cost: 15000 },
                          ].map(movie => {
                            const canStart = capital >= movie.cost;
                            return (
                              <View key={movie.title} style={styles.subWidgetRow}>
                                <View style={{ flex: 1 }}>
                                  <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{movie.title}</ThemedText>
                                  <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                                    {language === 'ru' ? `Сбор за прокат: ${formatCurrency(movie.cost)} | Длительность: ${movie.dur}с` : `Licensing: ${formatCurrency(movie.cost)} | Duration: ${movie.dur}s`}
                                  </ThemedText>
                                </View>
                                <Pressable
                                  disabled={!canStart}
                                  onPress={() => scheduleMovie(movie.title, movie.dur, movie.cost)}
                                  style={[styles.subWidgetAction, { borderColor: canStart ? theme.accent : theme.border }]}
                                >
                                  <ThemedText style={{ color: canStart ? theme.accent : theme.textSecondary, fontSize: 10, fontWeight: '700' }}>
                                    {language === 'ru' ? 'НАЧАТЬ' : 'START'}
                                  </ThemedText>
                                </Pressable>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </LedgerCard>
                )}

                {/* ✈️ AIRLINES PANEL */}
                {selectedBiz.id === 'airlines' && (
                  <LedgerCard title={language === 'ru' ? 'Управление авиалиниями' : 'Flight Routes Operations'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {airlineRoutes?.map(route => {
                        const canBuy = capital >= route.cost;
                        return (
                          <View key={route.id} style={styles.subWidgetRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{route.name}</ThemedText>
                              <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                                {route.purchased 
                                  ? (language === 'ru' ? `✓ РАБОТАЕТ — Доход: +${formatCurrency(route.income)}/сек` : `✓ ACTIVE — Yield: +${formatCurrency(route.income)}/s`)
                                  : (language === 'ru' ? `Цена открытия: ${formatCurrency(route.cost)} | Доход: +${formatCurrency(route.income)}/сек` : `Unlock Cost: ${formatCurrency(route.cost)} | Yield: +${formatCurrency(route.income)}/s`)
                                }
                              </ThemedText>
                            </View>
                            {!route.purchased && (
                              <Pressable
                                disabled={!canBuy}
                                onPress={() => buyAirlineRoute(route.id)}
                                style={[styles.subWidgetAction, { borderColor: canBuy ? theme.accent : theme.border }]}
                              >
                                <ThemedText style={{ color: canBuy ? theme.accent : theme.textSecondary, fontSize: 10, fontWeight: '700' }}>
                                  {language === 'ru' ? 'КУПИТЬ' : 'BUY'}
                                </ThemedText>
                              </Pressable>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}

                {/* 🏦 BANK DEDICATED PANEL */}
                {selectedBiz.id === 'bank' && (
                  <LedgerCard title={language === 'ru' ? 'Кредитная панель ЦБ' : 'NPC Credit Loan Agreements'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {/* Active bank loans list */}
                      {activeLoans && activeLoans.length > 0 && (
                        <View style={{ padding: 8, borderRadius: 8, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.border }}>
                          <ThemedText style={{ fontSize: 10, fontWeight: '800', color: theme.accent, marginBottom: 4 }}>
                            {language === 'ru' ? 'АКТИВНЫЕ ВЫДАННЫЕ КРЕДИТЫ' : 'ACTIVE ISSUED LOANS'} ({activeLoans.length})
                          </ThemedText>
                          {activeLoans.map(loan => (
                            <View key={loan.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 2 }}>
                              <View>
                                <ThemedText style={{ fontSize: 9, fontWeight: '700' }}>👤 {loan.applicant}</ThemedText>
                                <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                  {formatCurrency(loan.amount)} @ {loan.interestRate}% · Risk {loan.risk}%
                                </ThemedText>
                              </View>
                              <ThemedText style={{ fontSize: 9, color: theme.green, fontWeight: '700' }}>
                                +{formatCurrency(loan.paymentPerSecond)}/s ({Math.round(loan.duration)}s)
                              </ThemedText>
                            </View>
                          ))}
                        </View>
                      )}

                      {/* Loan applications from NPCs */}
                      <ThemedText style={{ fontSize: 10, fontWeight: '800', color: theme.accent, marginTop: 4, marginBottom: 4 }}>
                        {language === 'ru' ? 'ЗАЯВКИ НА КРЕДИТ' : 'INCOMING LOAN APPLICATIONS'}
                      </ThemedText>
                      {[
                        { id: 'app_1', applicant: language === 'ru' ? 'Торговый Центр' : 'Supermarket Chain', amount: 2000000, rate: 8, risk: 4, duration: 40 },
                        { id: 'app_2', applicant: language === 'ru' ? 'AI-Стартап' : 'AI Tech Startup', amount: 15000000, rate: 18, risk: 20, duration: 60 },
                        { id: 'app_3', applicant: language === 'ru' ? 'Застройщик Офисов' : 'Skyscraper Developer', amount: 80000000, rate: 12, risk: 10, duration: 90 },
                      ].map(app => {
                        const vaultCapacity = selectedBiz.bankVaultFund ?? 0;
                        const alreadyIssued = activeLoans?.some(l => l.amount === app.amount && l.interestRate === app.rate);
                        const canApprove = vaultCapacity >= app.amount && !alreadyIssued;
                        return (
                          <View key={app.id} style={styles.subWidgetRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={{ fontSize: 11, fontWeight: '700' }}>{app.applicant}</ThemedText>
                              <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                {language === 'ru' ? `Сумма: ${formatCurrency(app.amount)} · Ставка: ${app.rate}% · Риск: ${app.risk}%` : `Sum: ${formatCurrency(app.amount)} · Rate: ${app.rate}% · Risk: ${app.risk}%`}
                              </ThemedText>
                            </View>
                            <Pressable
                              disabled={!canApprove}
                              onPress={() => approveLoanRequest(app.amount, app.rate, app.risk, app.duration)}
                              style={[styles.subWidgetAction, { borderColor: canApprove ? theme.green : theme.border }]}
                            >
                              <ThemedText style={{ color: canApprove ? theme.green : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>
                                {alreadyIssued ? (language === 'ru' ? 'ВЫДАН' : 'ACTIVE') : (language === 'ru' ? 'ОДОБРИТЬ' : 'APPROVE')}
                              </ThemedText>
                            </Pressable>
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}

                {/* 💻 IT COMPANY PANEL */}
                {selectedBiz.id === 'it_company' && (
                  <LedgerCard title={language === 'ru' ? 'Разработка Софта' : 'IT Software Blueprints'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <ThemedText style={{ fontSize: 10, fontWeight: '800', color: theme.textSecondary }}>IT PUBLIC STATUS</ThemedText>
                        {itCompanyIPO_Launched ? (
                          <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 12, backgroundColor: theme.green + '20', borderWidth: 1, borderColor: theme.green }}>
                            <ThemedText style={{ fontSize: 8, color: theme.green, fontWeight: '800' }}>PUBLIC IPO (ITCO)</ThemedText>
                          </View>
                        ) : (
                          <Pressable
                            disabled={capital < 10000000}
                            onPress={launchITIPO}
                            style={({ pressed }) => [
                              { 
                                paddingHorizontal: 8, 
                                paddingVertical: 3, 
                                borderRadius: 6, 
                                backgroundColor: capital >= 10000000 ? theme.accent : theme.backgroundSelected, 
                                borderWidth: 1, 
                                borderColor: theme.accent, 
                                opacity: pressed ? 0.8 : 1 
                              }
                            ]}
                          >
                            <ThemedText style={{ fontSize: 8, color: capital >= 10000000 ? '#fff' : theme.textSecondary, fontWeight: '800' }}>
                              LAUNCH IPO ($10M)
                            </ThemedText>
                          </Pressable>
                        )}
                      </View>

                      {itProjects.map(proj => {
                        const isRunning = proj.status === 'running';
                        const progressPct = (proj.progress / proj.duration) * 100;
                        const juniors = selectedBiz.employees.filter(e => e.role === 'junior').length;
                        const mids = selectedBiz.employees.filter(e => e.role === 'mid').length;
                        const seniors = selectedBiz.employees.filter(e => e.role === 'senior').length + selectedBiz.employees.filter(e => e.role === 'executive').length;
                        const reqMet = juniors >= proj.reqJunior && mids >= proj.reqMid && seniors >= proj.reqSenior;

                        return (
                          <View key={proj.id} style={styles.subWidgetRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{proj.name}</ThemedText>
                              <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                Cost: {formatCurrency(proj.cost)} | Return: {formatCurrency(proj.payout)} ({proj.duration}s)
                              </ThemedText>
                              <ThemedText style={{ fontSize: 8, color: reqMet ? theme.green : theme.red }}>
                                Req: Junior {proj.reqJunior}, Mid {proj.reqMid}, Senior {proj.reqSenior}
                              </ThemedText>
                              {isRunning && (
                                <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 4, height: 4 }]}>
                                  <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.accent }]} />
                                </View>
                              )}
                            </View>
                            {isRunning ? (
                              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <ThemedText style={{ fontSize: 9, color: theme.accent, fontWeight: '800' }}>{Math.round(proj.duration - proj.progress)}s</ThemedText>
                                <Pressable
                                  disabled={capital < Math.round((proj.duration - proj.progress) * 65000)}
                                  onPress={() => speedUpITProject(proj.id)}
                                  style={({ pressed }) => [
                                    {
                                      paddingHorizontal: 6,
                                      paddingVertical: 3,
                                      borderRadius: 4,
                                      borderWidth: 1,
                                      borderColor: capital >= Math.round((proj.duration - proj.progress) * 65000) ? theme.green : theme.border,
                                      backgroundColor: capital >= Math.round((proj.duration - proj.progress) * 65000) ? theme.green + '15' : 'transparent',
                                      opacity: pressed ? 0.7 : 1,
                                    }
                                  ]}
                                >
                                  <ThemedText style={{ fontSize: 7.5, fontWeight: '800', color: capital >= Math.round((proj.duration - proj.progress) * 65000) ? theme.green : theme.textSecondary }}>
                                    ⚡ {language === 'ru' ? 'УСКОРИТЬ' : 'SPEED UP'} ({formatCurrency(Math.round((proj.duration - proj.progress) * 65000))})
                                  </ThemedText>
                                </Pressable>
                              </View>
                            ) : (
                              <Pressable
                                disabled={!reqMet}
                                onPress={() => startITProject(proj.id)}
                                style={[styles.subWidgetAction, { borderColor: reqMet ? theme.accent : theme.border }]}
                              >
                                <ThemedText style={{ color: reqMet ? theme.accent : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>START</ThemedText>
                              </Pressable>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}

                {/* 🏗️ CONSTRUCTION STEEL PANEL */}
                {selectedBiz.id === 'construction' && (
                  <LedgerCard title={language === 'ru' ? 'Строительные Контракты' : 'Skyscraper blueprints'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {skyscraperProjects.map(sky => {
                        const isBuilding = sky.status === 'building';
                        const progressPct = (sky.progress / sky.duration) * 100;
                        const canBuild = capital >= sky.cost;

                        return (
                          <View key={sky.id} style={styles.subWidgetRow}>
                            <View style={{ flex: 1 }}>
                              <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{sky.name}</ThemedText>
                              <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                Cost: {formatCurrency(sky.cost)} | Return: {formatCurrency(sky.payout)} ({sky.duration}s)
                              </ThemedText>
                              {isBuilding && (
                                <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 4, height: 4 }]}>
                                  <View style={[styles.progressFill, { width: `${progressPct}%`, backgroundColor: theme.accent }]} />
                                </View>
                              )}
                            </View>
                            {isBuilding ? (
                              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                <ThemedText style={{ fontSize: 9, color: theme.accent, fontWeight: '800' }}>{Math.round(sky.duration - sky.progress)}s</ThemedText>
                                <Pressable
                                  disabled={capital < Math.round((sky.duration - sky.progress) * 98000)}
                                  onPress={() => speedUpSkyscraper(sky.id)}
                                  style={({ pressed }) => [
                                    {
                                      paddingHorizontal: 6,
                                      paddingVertical: 3,
                                      borderRadius: 4,
                                      borderWidth: 1,
                                      borderColor: capital >= Math.round((sky.duration - sky.progress) * 98000) ? theme.green : theme.border,
                                      backgroundColor: capital >= Math.round((sky.duration - sky.progress) * 98000) ? theme.green + '15' : 'transparent',
                                      opacity: pressed ? 0.7 : 1,
                                    }
                                  ]}
                                >
                                  <ThemedText style={{ fontSize: 7.5, fontWeight: '800', color: capital >= Math.round((sky.duration - sky.progress) * 98000) ? theme.green : theme.textSecondary }}>
                                    ⚡ {language === 'ru' ? 'УСКОРИТЬ' : 'SPEED UP'} ({formatCurrency(Math.round((sky.duration - sky.progress) * 98000))})
                                  </ThemedText>
                                </Pressable>
                              </View>
                            ) : (
                              <Pressable
                                disabled={!canBuild}
                                onPress={() => startSkyscraper(sky.id)}
                                style={[styles.subWidgetAction, { borderColor: canBuild ? theme.green : theme.border }]}
                              >
                                <ThemedText style={{ color: canBuild ? theme.green : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>BUILD</ThemedText>
                              </Pressable>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}

                {/* 🚗 CAR DEALERSHIP FLIPPING PANEL */}
                {selectedBiz.id === 'car_dealership' && (
                  <LedgerCard title={language === 'ru' ? 'Перепродажа Авто' : 'Car Flipping garage'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {flippedCars.map(car => {
                        const isBuyable = car.status === 'buyable';
                        const isRepairing = car.status === 'repairing' && car.repairProgress === 0;
                        const isFixing = car.status === 'repairing' && car.repairProgress > 0;
                        const isRepaired = car.status === 'repaired';
                        const repairProgressPct = (car.repairProgress / car.repairTime) * 100;

                        return (
                          <View key={car.id} style={styles.subWidgetRow}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                              <ThemedText style={{ fontSize: 12, fontWeight: '700' }}>{car.name}</ThemedText>
                              <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                Buy: {formatCurrency(car.buyPrice)} | Fix: {formatCurrency(car.repairCost)} | Sell: {formatCurrency(car.sellPrice)}
                              </ThemedText>
                              {isFixing && (
                                <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 4, height: 4 }]}>
                                  <View style={[styles.progressFill, { width: `${repairProgressPct}%`, backgroundColor: theme.accent }]} />
                                </View>
                              )}
                            </View>
                            <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                              {isBuyable && (
                                <Pressable
                                  disabled={capital < car.buyPrice}
                                  onPress={() => buyCarForFlipping(car.id)}
                                  style={[styles.subWidgetAction, { borderColor: capital >= car.buyPrice ? theme.accent : theme.border }]}
                                >
                                  <ThemedText style={{ color: capital >= car.buyPrice ? theme.accent : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>BUY</ThemedText>
                                </Pressable>
                              )}
                              {isRepairing && (
                                <Pressable
                                  disabled={capital < car.repairCost}
                                  onPress={() => repairCar(car.id)}
                                  style={[styles.subWidgetAction, { borderColor: capital >= car.repairCost ? theme.green : theme.border }]}
                                >
                                  <ThemedText style={{ color: capital >= car.repairCost ? theme.green : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>REPAIR</ThemedText>
                                </Pressable>
                              )}
                              {isFixing && (
                                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                                  <ThemedText style={{ fontSize: 9, color: theme.accent, fontWeight: '800' }}>{Math.round(car.repairTime - car.repairProgress)}s</ThemedText>
                                  <Pressable
                                    disabled={capital < Math.round((car.repairTime - car.repairProgress) * 22000)}
                                    onPress={() => speedUpCarRepair(car.id)}
                                    style={({ pressed }) => [
                                      {
                                        paddingHorizontal: 6,
                                        paddingVertical: 3,
                                        borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: capital >= Math.round((car.repairTime - car.repairProgress) * 22000) ? theme.green : theme.border,
                                        backgroundColor: capital >= Math.round((car.repairTime - car.repairProgress) * 22000) ? theme.green + '15' : 'transparent',
                                        opacity: pressed ? 0.7 : 1,
                                      }
                                    ]}
                                  >
                                    <ThemedText style={{ fontSize: 7.5, fontWeight: '800', color: capital >= Math.round((car.repairTime - car.repairProgress) * 22000) ? theme.green : theme.textSecondary }}>
                                      ⚡ {language === 'ru' ? 'УСКОРИТЬ' : 'SPEED UP'} ({formatCurrency(Math.round((car.repairTime - car.repairProgress) * 22000))})
                                    </ThemedText>
                                  </Pressable>
                                </View>
                              )}
                              {isRepaired && (
                                <Pressable
                                  onPress={() => sellFlippedCar(car.id)}
                                  style={[styles.subWidgetAction, { borderColor: theme.green, backgroundColor: theme.green + '20' }]}
                                >
                                  <ThemedText style={{ color: theme.green, fontSize: 9, fontWeight: '700' }}>SELL</ThemedText>
                                </Pressable>
                              )}
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </LedgerCard>
                )}


                {/* ⚽ FOOTBALL CLUB PANEL */}
                {selectedBiz.id === 'football_club' && (
                  <View style={{ gap: 12 }}>
                    <LedgerCard title={language === 'ru' ? 'Информация о Клубе' : 'Club Overview'} borderAccentColor={theme.accent}>
                      <View style={{ gap: 6, marginTop: 4 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>{language === 'ru' ? 'ТРЕНИРОВКА СОСТАВА:' : 'SQUAD TRAINING:'}</ThemedText>
                          <ThemedText style={{ fontSize: 11, fontWeight: '800', color: theme.green }}>LVL {fcTrainingLevel} (+{fcTrainingLevel * 2} Rating)</ThemedText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>{language === 'ru' ? 'ИГРОКИ В КОМАНДЕ:' : 'SQUAD SIZE:'}</ThemedText>
                          <ThemedText style={{ fontSize: 11, fontWeight: '800' }}>{fcPlayers.length} / 11</ThemedText>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                          <ThemedText style={{ fontSize: 11, color: theme.textSecondary }}>{language === 'ru' ? 'СРЕДНИЙ РЕЙТИНГ:' : 'AVG SQUAD RATING:'}</ThemedText>
                          <ThemedText style={{ fontSize: 11, fontWeight: '800', color: theme.accent }}>
                            {(fcPlayers.length > 0 ? (fcPlayers.reduce((s, p) => s + p.rating, 0) / fcPlayers.length) : 0).toFixed(0)} rating
                          </ThemedText>
                        </View>
                      </View>
                    </LedgerCard>

                    <LedgerCard title={language === 'ru' ? 'Действия и Трансферы' : 'Club Transfers & Training'} borderAccentColor={theme.green}>
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <Pressable
                          disabled={fcPlayers.length >= 11 || capital < 2500000}
                          onPress={recruitFootballPlayer}
                          style={({ pressed }) => [
                            styles.recruitBtn,
                            { backgroundColor: theme.accent, opacity: (fcPlayers.length >= 11 || capital < 2500000) ? 0.4 : pressed ? 0.8 : 1 }
                          ]}
                        >
                          <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>
                            {language === 'ru' ? `ПОДПИСАТЬ ИГРОКА ($2.50M)` : `RECRUIT PLAYER ($2.50M)`}
                          </ThemedText>
                        </Pressable>

                        <Pressable
                          disabled={capital < fcTrainingLevel * 2500000}
                          onPress={trainFootballSquad}
                          style={({ pressed }) => [
                            styles.recruitBtn,
                            { backgroundColor: theme.backgroundElement, borderWidth: 1, borderColor: theme.green, opacity: (capital < fcTrainingLevel * 2500000) ? 0.4 : pressed ? 0.8 : 1 }
                          ]}
                        >
                          <ThemedText style={{ color: theme.green, fontWeight: '800', fontSize: 12 }}>
                            {language === 'ru' ? `ПРОВЕСТИ ТРЕНИРОВКУ ($${(fcTrainingLevel * 2.5).toFixed(2)}M)` : `TRAIN SQUAD ($${(fcTrainingLevel * 2.5).toFixed(2)}M)`}
                          </ThemedText>
                        </Pressable>
                      </View>
                    </LedgerCard>

                    <LedgerCard title={language === 'ru' ? 'Календарь Матчей' : 'Match Fixtures'} borderAccentColor={theme.accent}>
                      <View style={{ gap: 8, marginTop: 4 }}>
                        {fcMatchLog ? (
                          <View style={{ padding: 8, borderRadius: 6, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.border, marginBottom: 4 }}>
                            <ThemedText style={{ fontSize: 9, fontWeight: '700', color: theme.accent, marginBottom: 2 }}>{language === 'ru' ? 'ПОСЛЕДНЕЕ СОБЫТИЕ:' : 'LATEST DISPATCH:'}</ThemedText>
                            <ThemedText style={{ fontSize: 9, color: theme.text }}>{fcMatchLog}</ThemedText>
                          </View>
                        ) : null}

                        {fcMatchActive ? (
                          <View style={{ marginVertical: 6 }}>
                            <ThemedText style={{ fontSize: 11, fontWeight: '700', color: theme.accent, textAlign: 'center' }}>
                              ⚽ {language === 'ru' ? 'ИГРА В ПРОЦЕССЕ...' : 'MATCH UNDERWAY...'}
                            </ThemedText>
                            <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 6, height: 6 }]}>
                              <View style={[styles.progressFill, { width: `${(fcMatchTimer / 5) * 100}%`, backgroundColor: theme.accent }]} />
                            </View>
                          </View>
                        ) : (
                          <View style={{ gap: 6 }}>
                            {[
                              { name: language === 'ru' ? 'Региональный Кубок' : 'Regional Cup Match', rating: 60, fee: 350000 },
                              { name: language === 'ru' ? 'Национальная Лига' : 'National League Match', rating: 78, fee: 1200000 },
                              { name: language === 'ru' ? 'Европейский Финал' : 'Euro Championship Final', rating: 92, fee: 4500000 }
                            ].map(match => (
                              <View key={match.name} style={styles.subWidgetRow}>
                                <View style={{ flex: 1 }}>
                                  <ThemedText style={{ fontSize: 11, fontWeight: '700' }}>{match.name}</ThemedText>
                                  <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                    {language === 'ru' ? `Сложность: ${match.rating} Rating · Награда: +${formatCurrency(match.fee)}` : `Opponent: ${match.rating} Rating · Prize: +${formatCurrency(match.fee)}`}
                                  </ThemedText>
                                </View>
                                <Pressable
                                  onPress={() => startFootballMatch(match.rating, match.fee)}
                                  style={[styles.subWidgetAction, { borderColor: theme.accent }]}
                                >
                                  <ThemedText style={{ color: theme.accent, fontSize: 9, fontWeight: '700' }}>{language === 'ru' ? 'МАТЧ' : 'PLAY'}</ThemedText>
                                </Pressable>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </LedgerCard>
                  </View>
                )}

                {/* 👗 CLOTHING BRAND PANEL */}
                {selectedBiz.id === 'clothing_brand' && (
                  <LedgerCard title={language === 'ru' ? 'Выпуск Линейки Одежды' : 'Fashion Runway Collection'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      {clothingCollectionActive ? (
                        <View style={{ marginVertical: 6 }}>
                          <ThemedText style={{ fontSize: 11, fontWeight: '700', color: theme.accent }}>
                            👗 {language === 'ru' ? `КОЛЛЕКЦИЯ "${clothingCollectionName.toUpperCase()}" В ПОШИВЕ...` : `COLLECTION "${clothingCollectionName.toUpperCase()}" MANUFACTURING...`}
                          </ThemedText>
                          <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 6, height: 6 }]}>
                            <View style={[styles.progressFill, { width: `${(clothingCollectionProgress / clothingCollectionDuration) * 100}%`, backgroundColor: theme.accent }]} />
                          </View>
                          <ThemedText style={{ fontSize: 8, color: theme.textSecondary, marginTop: 4 }}>
                            {language === 'ru' ? `Осталось времени: ${Math.round(clothingCollectionDuration - clothingCollectionProgress)}с` : `Completes in ${Math.round(clothingCollectionDuration - clothingCollectionProgress)}s`}
                          </ThemedText>
                        </View>
                      ) : (
                        <View style={{ gap: 8 }}>
                          <ThemedText type="small" themeColor="textSecondary">
                            {language === 'ru' ? 'Придумайте название и выберите бюджет для создания эксклюзивной коллекции одежды.' : 'Define your runway collection name and sign off funding structure to launch production.'}
                          </ThemedText>
                          <TextInput
                            value={clothingNameInput}
                            onChangeText={setClothingNameInput}
                            placeholder={language === 'ru' ? 'Напр. Summer Chic 2026' : 'e.g. Neo-Gothic Winter'}
                            placeholderTextColor={theme.textSecondary}
                            style={[styles.namingInput, { borderColor: theme.border, color: theme.text, marginBottom: 8 }]}
                          />
                          <View style={{ flexDirection: 'row', gap: 6 }}>
                            {[
                              { label: language === 'ru' ? 'Эконом ($200K)' : 'Eco ($200K)', budget: 200000, dur: 12 },
                              { label: language === 'ru' ? 'Бизнес ($1.0M)' : 'Mid ($1.0M)', budget: 1000000, dur: 30 },
                              { label: language === 'ru' ? 'От Кутюр ($5.0M)' : 'Couture ($5.0M)', budget: 5000000, dur: 75 }
                            ].map(tier => {
                              const canStart = capital >= tier.budget;
                              return (
                                <Pressable
                                  key={tier.label}
                                  disabled={!canStart}
                                  onPress={() => {
                                    startClothingCollection(clothingNameInput || 'Urban Elite', tier.budget, tier.dur);
                                    setClothingNameInput('');
                                  }}
                                  style={({ pressed }) => [
                                    styles.clickActiveUpgrade,
                                    { borderColor: canStart ? theme.accent : theme.border, opacity: pressed ? 0.8 : 1 }
                                  ]}
                                >
                                  <ThemedText style={{ fontSize: 9, fontWeight: '700', color: canStart ? theme.accent : theme.textSecondary, textAlign: 'center' }}>
                                    {tier.label}
                                  </ThemedText>
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                      )}
                    </View>
                  </LedgerCard>
                )}

                {/* 🛢️ OIL & GAS PANEL */}
                {selectedBiz.id === 'oil_gas' && (
                  <LedgerCard title={language === 'ru' ? 'Бурение и Нефтедобыча' : 'Oil Wells Drilling Operations'} borderAccentColor={theme.accent}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 6 }}>
                        <View>
                          <ThemedText style={{ fontSize: 12, fontWeight: '800' }}>🛢️ {oilWellsCount} {language === 'ru' ? 'активных скважин' : 'drilled wells'}</ThemedText>
                          <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>
                            {language === 'ru' ? `В резервуарах: ${oilReserve.toLocaleString()} барр. · Добыча: +${(oilWellsCount * 0.45).toFixed(1)}/сек` : `Reserve: ${oilReserve.toLocaleString()} bbl · Flow: +${(oilWellsCount * 0.45).toFixed(1)}/s`}
                          </ThemedText>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <ThemedText style={{ fontSize: 12, fontWeight: '800', color: theme.green }}>${oilPrice.toFixed(2)}</ThemedText>
                          <ThemedText style={{ fontSize: 9, color: theme.textSecondary }}>{language === 'ru' ? 'рыночная цена' : 'market barrel price'}</ThemedText>
                        </View>
                      </View>

                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <Pressable
                          disabled={capital < (oilWellsCount + 1) * 8500000}
                          onPress={drillOilWell}
                          style={({ pressed }) => [
                            styles.clickActiveBtn,
                            { backgroundColor: theme.accent, opacity: capital < (oilWellsCount + 1) * 8500000 ? 0.4 : pressed ? 0.8 : 1 }
                          ]}
                        >
                          <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 11 }}>
                            {language === 'ru' ? `БУРИТЬ СКВАЖИНУ ($${((oilWellsCount + 1) * 8.5).toFixed(1)}M)` : `DRILL WELL ($${((oilWellsCount + 1) * 8.5).toFixed(1)}M)`}
                          </ThemedText>
                        </Pressable>
                        <Pressable
                          disabled={oilReserve <= 0}
                          onPress={sellOilReserves}
                          style={({ pressed }) => [
                            styles.clickActiveUpgrade,
                            { borderColor: oilReserve > 0 ? theme.green : theme.border, opacity: pressed ? 0.8 : 1 }
                          ]}
                        >
                          <ThemedText style={{ color: oilReserve > 0 ? theme.green : theme.textSecondary, fontSize: 10, fontWeight: '800', textAlign: 'center' }}>
                            {language === 'ru' ? `ПРОДАТЬ НЕФТЬ\n+$${Math.round(oilReserve * oilPrice).toLocaleString()}` : `SELL RESERVES\n+$${Math.round(oilReserve * oilPrice).toLocaleString()}`}
                          </ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  </LedgerCard>
                )}

                {/* 🚀 SPACE AGENCY PANEL */}
                {selectedBiz.id === 'space_agency' && (
                  <View style={{ gap: 12 }}>
                    <LedgerCard title={language === 'ru' ? 'Космическая Программа' : 'Orbital Space Telemetry'} borderAccentColor={theme.accent}>
                      <View style={{ gap: 8, marginTop: 4 }}>
                        {spaceMissionLog ? (
                          <View style={{ padding: 8, borderRadius: 6, backgroundColor: theme.background, borderWidth: 1, borderColor: theme.border, marginBottom: 4 }}>
                            <ThemedText style={{ fontSize: 9, fontWeight: '700', color: theme.accent, marginBottom: 2 }}>{language === 'ru' ? 'СВОДКА ИЗ ЦУП:' : 'MISSION LOG:'}</ThemedText>
                            <ThemedText style={{ fontSize: 9, color: theme.text }}>{spaceMissionLog}</ThemedText>
                          </View>
                        ) : null}

                        {spaceMissionActive && spaceMissionDestination ? (
                          <View style={{ marginVertical: 6 }}>
                            <ThemedText style={{ fontSize: 11, fontWeight: '700', color: theme.accent }}>
                              🚀 {language === 'ru' ? `ПОЛЕТ НА ${spaceMissionDestination.toUpperCase()}...` : `FLIGHT TO ${spaceMissionDestination.toUpperCase()}...`}
                            </ThemedText>
                            <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 6, height: 6 }]}>
                              <View style={[styles.progressFill, { width: `${(spaceMissionProgress / spaceMissionDuration) * 100}%`, backgroundColor: theme.accent }]} />
                            </View>
                            <ThemedText style={{ fontSize: 8, color: theme.textSecondary, marginTop: 4 }}>
                              {language === 'ru' ? `Приземление через: ${Math.round(spaceMissionDuration - spaceMissionProgress)}с` : `Time to arrival: ${Math.round(spaceMissionDuration - spaceMissionProgress)}s`}
                            </ThemedText>
                          </View>
                        ) : (
                          <View style={{ gap: 6 }}>
                            {[
                              { label: language === 'ru' ? 'Спутник Связи' : 'Sat Transponder (Orbit)', dest: 'orbit' as const, cost: 20000000, dur: 15, rate: 90 },
                              { label: language === 'ru' ? 'Лунный Модуль' : 'Lunar Science Rover', dest: 'moon' as const, cost: 80000000, dur: 45, rate: 75 },
                              { label: language === 'ru' ? 'Экспедиция Марса' : 'Mars Settlement Module', dest: 'mars' as const, cost: 350000000, dur: 120, rate: 50 }
                            ].map(mission => {
                              const canLaunch = capital >= mission.cost;
                              return (
                                <View key={mission.label} style={styles.subWidgetRow}>
                                  <View style={{ flex: 1 }}>
                                    <ThemedText style={{ fontSize: 11, fontWeight: '700' }}>{mission.label}</ThemedText>
                                    <ThemedText style={{ fontSize: 8, color: theme.textSecondary }}>
                                      {language === 'ru' ? `Бюджет: $${(mission.cost / 1000000).toFixed(0)}M · Время: ${mission.dur}с · Успех: ${mission.rate}%` : `Cost: $${(mission.cost / 1000000).toFixed(0)}M · Time: ${mission.dur}s · Success: ${mission.rate}%`}
                                    </ThemedText>
                                  </View>
                                  <Pressable
                                    disabled={!canLaunch}
                                    onPress={() => launchSpaceMission(mission.dest, mission.cost, mission.dur, mission.rate)}
                                    style={[styles.subWidgetAction, { borderColor: canLaunch ? theme.accent : theme.border }]}
                                  >
                                    <ThemedText style={{ color: canLaunch ? theme.accent : theme.textSecondary, fontSize: 9, fontWeight: '700' }}>{language === 'ru' ? 'ЗАПУСК' : 'LAUNCH'}</ThemedText>
                                  </Pressable>
                                </View>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </LedgerCard>
                  </View>
                )}

                {/* 🏭 RETAIL/FACTORY GENERAL ACTIVE OPERATIONS */}
                {selectedBiz.id !== 'car_wash' && selectedBiz.id !== 'taxi' && selectedBiz.id !== 'cinema' && selectedBiz.id !== 'airlines' && selectedBiz.id !== 'bank' && selectedBiz.id !== 'it_company' && selectedBiz.id !== 'construction' && selectedBiz.id !== 'car_dealership' && selectedBiz.id !== 'football_club' && selectedBiz.id !== 'clothing_brand' && selectedBiz.id !== 'oil_gas' && selectedBiz.id !== 'space_agency' && (
                  <LedgerCard title={language === 'ru' ? 'Активный Конвейер Производства' : 'Active Manufacturing Ticks'}>
                    <View style={{ gap: 8, marginTop: 4 }}>
                      <ThemedText type="small" themeColor="textSecondary">
                        {language === 'ru' 
                          ? 'Запустите ручной производственный цикл. Через 10 сек вы мгновенно получите бонус в размере 5x от базового секундного дохода!'
                          : 'Manually run a production cycle. After 10s of processing, receive a 5x immediate cash return boost!'}
                      </ThemedText>
                      
                      {productionTimers[selectedBiz.id]?.active ? (
                        <View style={{ marginVertical: 6 }}>
                          <ThemedText style={{ fontSize: 11, fontWeight: '700', color: theme.accent }}>
                            🏭 {language === 'ru' ? 'ПРОИЗВОДСТВО В ПРОЦЕССЕ...' : 'PROCESSING CYCLE...'}
                          </ThemedText>
                          <View style={[styles.progressTrack, { backgroundColor: theme.background, marginTop: 6, height: 6 }]}>
                            <View style={[styles.progressFill, { width: `${productionTimers[selectedBiz.id].progress}%`, backgroundColor: theme.accent }]} />
                          </View>
                        </View>
                      ) : (
                        <Pressable
                          onPress={() => runActiveProduction(selectedBiz.id, selectedBiz.income * selectedBiz.count * selectedBiz.level)}
                          style={({ pressed }) => [
                            styles.clickActiveBtn,
                            { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1, marginVertical: 6 }
                          ]}
                        >
                          <Play size={14} color="#fff" />
                          <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 12, marginLeft: 6 }}>
                            {language === 'ru' ? 'ЗАПУСТИТЬ ЦИКЛ СБОРКИ' : 'RUN ASSEMBLY LINE CYCLE'}
                          </ThemedText>
                        </Pressable>
                      )}
                    </View>
                  </LedgerCard>
                )}
              </View>
            )}

            {/* 4. MANAGEMENT VIEW (RENAME / SELL) */}
            {detailsTab === 'management' && (
              <View style={{ gap: 12 }}>
                <LedgerCard title={language === 'ru' ? 'Переименовать компанию' : 'Corporate Identity'}>
                  <View style={{ gap: 8, marginTop: 6 }}>
                    <TextInput
                      value={namingInput}
                      onChangeText={setNamingInput}
                      placeholder={selectedBiz.customName || selectedBiz.name}
                      placeholderTextColor={theme.textSecondary}
                      style={[styles.namingInput, { borderColor: theme.accent, color: theme.text }]}
                    />
                    <Pressable
                      onPress={() => {
                        const cleanVal = namingInput.trim();
                        if (!cleanVal) return;
                        renameBusiness(selectedBiz.id, cleanVal);
                        Alert.alert(language === 'ru' ? 'Имя успешно изменено' : 'Identity Updated');
                      }}
                      style={({ pressed }) => [
                        styles.recruitBtn,
                        { backgroundColor: theme.accent, opacity: pressed ? 0.8 : 1, marginTop: 4 }
                      ]}
                    >
                      <RotateCw size={14} color="#fff" />
                      <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 12, marginLeft: 6 }}>
                        {language === 'ru' ? 'СОХРАНИТЬ НОВОЕ ИМЯ' : 'APPLY NEW CORP NAME'}
                      </ThemedText>
                    </Pressable>
                  </View>
                </LedgerCard>

                <LedgerCard title={language === 'ru' ? 'Ликвидация предприятия' : 'Danger Zone / Shell Corporation Sell-off'} borderAccentColor={theme.red}>
                  <View style={{ gap: 8, marginTop: 6 }}>
                    <ThemedText type="small" themeColor="textSecondary">
                      {language === 'ru' 
                        ? 'Продажа фирмы вернет вам 70% от всех потраченных на нее средств. Все нанятые сотрудники будут немедленно уволены, а уровни сброшены.'
                        : 'Selling off this corporation will refund 70% of its current cumulative asset value. All active staff members will be permanently laid off and levels will be completely reset.'}
                    </ThemedText>

                    <Pressable
                      onPress={() => {
                        Alert.alert(
                          language === 'ru' ? 'Ликвидировать фирму?' : 'Sell Corporation?',
                          language === 'ru' 
                            ? 'Это действие безвозвратно удалит штат и прокачку вашей фирмы.' 
                            : 'This will permanently erase your staff and tier upgrades.',
                          [
                            { text: language === 'ru' ? 'Отмена' : 'Cancel', style: 'cancel' },
                            { 
                              text: language === 'ru' ? 'ЛИКВИДИРОВАТЬ' : 'CONFIRM SELL-OFF', 
                              style: 'destructive',
                              onPress: () => {
                                sellBusiness(selectedBiz.id);
                                setActiveView('list');
                              }
                            }
                          ]
                        );
                      }}
                      style={({ pressed }) => [
                        styles.recruitBtn,
                        { backgroundColor: theme.red, borderColor: theme.red, opacity: pressed ? 0.8 : 1 }
                      ]}
                    >
                      <Trash2 size={15} color="#fff" />
                      <ThemedText style={{ color: '#fff', fontWeight: '800', fontSize: 12, marginLeft: 6 }}>
                        {language === 'ru' 
                          ? `ЛИКВИДИРОВАТЬ КОМПАНИЮ (ВОЗВРАТ: ${formatCurrency(Math.round((selectedBiz.cost / selectedBiz.costMultiplier) * selectedBiz.count * 0.7))})` 
                          : `SELL OFF CORPORATION (REFUND: ${formatCurrency(Math.round((selectedBiz.cost / selectedBiz.costMultiplier) * selectedBiz.count * 0.7))})`}
                      </ThemedText>
                    </Pressable>
                  </View>
                </LedgerCard>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 40 },
  headerBand: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1 },
  headerItem: { flex: 1, alignItems: 'center' },
  headerLabel: { fontSize: 9, letterSpacing: 1.5, fontWeight: '700', color: '#9CA3AF', marginBottom: 2 },
  headerValue: { fontSize: 13, fontWeight: '800' },
  headerDivider: { width: 1, height: 32, alignSelf: 'center' },

  mergeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  mergeBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  
  listContainer: { paddingHorizontal: 12, paddingTop: 10, gap: 10 },
  listItemContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  actionBtn: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center', alignItems: 'center' },

  // Naming screen styles
  namingContainer: { flex: 1, padding: 20, justifyContent: 'center' },
  backBtn: { flexDirection: 'row', alignItems: 'center', position: 'absolute', top: 20, left: 20, paddingVertical: 10 },
  namingCard: { padding: 24, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)', alignItems: 'center' },
  namingTitle: { fontSize: 16, fontWeight: '800', letterSpacing: 1, marginBottom: 8, textAlign: 'center' },
  namingInput: { width: '100%', height: 42, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, fontSize: 14, marginBottom: 20, textAlign: 'center' },
  namingSubmit: { width: '100%', height: 42, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },

  // Dedicated view styles
  detailsHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1 },
  detailsBackBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 4 },
  subTabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  subTabBtn: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  detailsTabContainer: { padding: 12, paddingBottom: 60 },

  upgradeBtnAction: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6 },
  sheetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 3 },

  recruitBtn: { flexDirection: 'row', width: '100%', height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  employeeCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' },
  fireBtn: { width: 30, height: 30, borderRadius: 6, borderWidth: 1, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center' },

  // Custom project subwidgets
  clickActiveBtn: { flex: 1.5, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  clickActiveUpgrade: { flex: 1, height: 40, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  subWidgetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  subWidgetAction: { borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },

  progressTrack: { width: '100%', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  vaultTracker: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  rateBtns: { flexDirection: 'row', gap: 6 },
  rateBtn: { width: 32, height: 32, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', justifyContent: 'center', alignItems: 'center' },
  segmentedContainer: { flexDirection: 'row', borderRadius: 8, padding: 3, gap: 4 },
});
