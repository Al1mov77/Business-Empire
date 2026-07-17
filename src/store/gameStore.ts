import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_REAL_ESTATE, INITIAL_LUXURY } from '@/constants/initialData';

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

export type EmployeeRole = 'junior' | 'mid' | 'senior' | 'executive';

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  skill: number;       // 1–100: bonus % to business income
  salary: number;      // per second cost
  hiredAt: number;
}

export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  cost: number;
  costMultiplier: number;
  income: number;
  count: number;
  level: number;          // 1–10
  upgradeCost: number;    // cost to raise level
  maxEmployees: number;   // grows with level
  employees: Employee[];
  managerCost: number;
  managerHired: boolean;
  icon: string;
  image: string;          // asset key for banner
  unlockAt: number;       // total earned threshold to appear

  // Custom bank logics
  bankVaultFund?: number;
  bankVaultCapacity?: number;
  depositRate?: number; // 1-10%
  loanRate?: number; // 1-10%
  customName?: string;
}

export interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  history: number[];
  volatility: number;
  sharesOwned: number;
  avgBuyPrice: number;
}

export interface Crypto {
  symbol: string;
  name: string;
  currentPrice: number;
  history: number[];
  volatility: number;
  coinsOwned: number;
  avgBuyPrice: number;
  icon: string;
  color: string;
}

export interface RealEstate {
  id: string;
  name: string;
  location: string;
  cost: number;
  rent: number;
  count: number;
  icon: string;
  upgradeLevel: number; // 1-5
  upgradeCost: number;
  class?: 'economy' | 'business' | 'luxury';
  imageUrl?: string;
}

export interface Luxury {
  id: string;
  name: string;
  cost: number;
  prestige: number;
  count: number;
  icon: string;
  category?: 'car' | 'plane' | 'jewelry' | 'luxury';
  class?: 'economy' | 'medium' | 'luxury' | 'collectible';
  imageUrl?: string;
}

export interface NFTAsset {
  id: string;
  name: string;
  costETH: number;
  prestige: number;
  count: number;
  icon: string;
  color: string;
}

export interface FlippedCar {
  id: string;
  name: string;
  class: 'economy' | 'medium' | 'luxury';
  buyPrice: number;
  repairCost: number;
  repairTime: number; // in seconds
  repairProgress: number; // 0 to repairTime
  sellPrice: number;
  status: 'buyable' | 'repairing' | 'repaired';
}

export interface ITProject {
  id: string;
  name: string;
  cost: number;
  payout: number;
  duration: number;
  progress: number;
  reqJunior: number;
  reqMid: number;
  reqSenior: number;
  status: 'idle' | 'running' | 'completed';
}

export interface SkyscraperProject {
  id: string;
  name: string;
  cost: number;
  payout: number;
  duration: number;
  progress: number;
  status: 'idle' | 'building' | 'completed';
}

export interface BankLoan {
  id: string;
  applicant: string;
  amount: number;
  interestRate: number;
  risk: number;
  duration: number;
  totalDuration: number;
  paymentPerSecond: number;
}

export interface FootballPlayer {
  id: string;
  name: string;
  rating: number;
  cost: number;
}

export interface AirlineRoute {
  id: string;
  name: string;
  distance: number;
  cost: number;
  income: number;
  purchased: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
  condition?: (state: GameState) => boolean;
}

export interface GameState {
  capital: number;
  totalEarned: number;
  prestige: number;
  netWorth: number;
  lastActive: number;
  offlineEarnings: number;

  // Settings & Upgrades
  language: 'en' | 'ru';
  themeOverride: 'system' | 'light' | 'dark';
  clickPowerLevel: number;

  // Game Elements
  businesses: Business[];
  stocks: Stock[];
  crypto: Crypto[];
  realEstate: RealEstate[];
  luxury: Luxury[];
  nfts: NFTAsset[];
  achievements: Achievement[];

  // Flipped cars market
  flippedCars: FlippedCar[];
  itProjects: ITProject[];
  skyscraperProjects: SkyscraperProject[];

  // Interactive business states
  itCompanyIPO_Launched: boolean;
  activeLoans: BankLoan[];
  cinemaMovieActive: string | null;
  cinemaMovieDuration: number;
  cinemaMovieProgress: number;
  airlineRoutes: AirlineRoute[];
  taxiFleet: { economy: number; comfort: number; business: number };
  carWashManualUpgrade: number;

  // New Interactive business states
  // Football Club
  fcPlayers: FootballPlayer[];
  fcTrainingLevel: number;
  fcMatchActive: boolean;
  fcMatchTimer: number;
  fcOpponentRating: number;
  fcMatchLog: string;
  // Clothing Brand
  clothingCollectionActive: boolean;
  clothingCollectionName: string;
  clothingCollectionProgress: number;
  clothingCollectionDuration: number;
  clothingCollectionQuality: number;
  // Oil & Gas
  oilWellsCount: number;
  oilPrice: number;
  oilReserve: number;
  // Space Agency
  spaceMissionActive: boolean;
  spaceMissionDestination: 'orbit' | 'moon' | 'mars' | null;
  spaceMissionProgress: number;
  spaceMissionDuration: number;
  spaceMissionSuccessRate: number;
  spaceMissionLog: string;

  // Daily Reward System
  dailyRewardStreak: number;
  lastDailyRewardClaimed: number;

  // New stats and R&D
  carsFlippedCount: number;
  totalClicks: number;
  rdUpgrades: Record<string, boolean>;

  // Actions — Settings
  setLanguage: (lang: 'en' | 'ru') => void;
  setThemeOverride: (theme: 'system' | 'light' | 'dark') => void;
  upgradeClickPower: () => void;
  cheatAddMoney: (amount: number) => void;

  // Actions — R&D Lab
  buyRDUpgrade: (id: string) => void;

  // Actions — Speed Up Mechanics
  speedUpITProject: (projectId: string) => void;
  speedUpSkyscraper: (projectId: string) => void;
  speedUpCinemaScreening: () => void;
  speedUpCarRepair: (carId: string) => void;

  // Actions — Business
  clickVault: () => void;
  buyBusiness: (id: string) => void;
  sellBusiness: (id: string) => void;
  renameBusiness: (id: string, name: string) => void;
  hireManager: (id: string) => void;
  upgradeBusiness: (id: string) => void;
  hireEmployee: (businessId: string) => void;
  fireEmployee: (businessId: string, employeeId: string) => void;

  // Interactive business actions
  washCarManually: () => void;
  upgradeCarWashSoap: () => void;
  scheduleMovie: (title: string, duration: number, fee: number) => void;
  buyTaxiCar: (carClass: 'economy' | 'comfort' | 'business', cost: number) => void;
  approveLoanRequest: (amount: number, interestRate: number, risk: number, duration: number) => void;
  buyAirlineRoute: (routeId: string) => void;
  launchITIPO: () => void;

  // New Interactive business actions
  recruitFootballPlayer: () => void;
  trainFootballSquad: () => void;
  startFootballMatch: (opponentRating: number, reward: number) => void;
  startClothingCollection: (name: string, budget: number, duration: number) => void;
  drillOilWell: () => void;
  sellOilReserves: () => void;
  launchSpaceMission: (dest: 'orbit' | 'moon' | 'mars', cost: number, duration: number, rate: number) => void;

  // Bank sliders configuration
  setBankRates: (id: string, depositRate: number, loanRate: number) => void;

  // IT Company projects
  startITProject: (projectId: string) => void;

  // Car Dealership flipping
  buyCarForFlipping: (carId: string) => void;
  repairCar: (carId: string) => void;
  sellFlippedCar: (carId: string) => void;
  refreshFlippedCars: () => void;

  // Construction skyscraper building
  startSkyscraper: (projectId: string) => void;

  // Actions — Stocks
  buyStock: (symbol: string, shares: number) => void;
  sellStock: (symbol: string, shares: number) => void;

  // Actions — Crypto
  buyCrypto: (symbol: string, coins: number) => void;
  sellCrypto: (symbol: string, coins: number) => void;

  // Actions — Assets & Luxury
  buyRealEstate: (id: string) => void;
  upgradeProperty: (id: string) => void;
  buyLuxury: (id: string) => void;
  buyNFT: (id: string) => void;

  // Daily Reward claim
  claimDailyReward: () => void;

  // Merger mechanics
  mergeBusinesses: (mergeType: 'holding' | 'hitech' | 'oilgas') => void;

  // System Loop
  tickGame: (seconds: number) => void;
  tickStocks: () => void;
  tickCrypto: () => void;
  checkAchievements: () => void;
  clearOfflineEarnings: () => void;
}

// ─────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────

const ROLE_LABELS: Record<EmployeeRole, string> = {
  junior: 'Junior Staff',
  mid: 'Mid-Level',
  senior: 'Senior Expert',
  executive: 'Executive',
};
const ROLE_SKILL: Record<EmployeeRole, [number, number]> = {
  junior: [15, 25],
  mid: [30, 55],
  senior: [60, 80],
  executive: [85, 100],
};
const ROLE_SALARY_MULT: Record<EmployeeRole, number> = {
  junior: 0.002,
  mid: 0.006,
  senior: 0.014,
  executive: 0.03,
};

export function generateCandidate(businessIncome: number, level: number): Employee {
  const role: EmployeeRole = level >= 8 ? 'executive' : level >= 6 ? 'senior' : level >= 3 ? 'mid' : 'junior';
  const [minSkill, maxSkill] = ROLE_SKILL[role];
  const skill = Math.floor(Math.random() * (maxSkill - minSkill + 1)) + minSkill;
  const salary = Math.max(0.01, businessIncome * ROLE_SALARY_MULT[role] * (skill / 50));
  return {
    id: `emp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: randomName(),
    role,
    skill,
    salary: Math.round(salary * 100) / 100,
    hiredAt: Date.now(),
  };
}

const FIRST_NAMES = ['Alex','Morgan','Jordan','Taylor','Casey','Sam','Jamie','Riley','Avery','Quinn','Blake','Drew','Reese','Parker','Skylar'];
const LAST_NAMES = ['Smith','Johnson','Lee','Chen','Patel','Müller','Santos','Kim','Ivanov','Rossi','García','Nakamura','Williams','Brown','Davis'];
function randomName() {
  return `${FIRST_NAMES[Math.floor(Math.random()*FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random()*LAST_NAMES.length)]}`;
}

export { ROLE_LABELS };

// ─────────────────────────────────────────────
//  INITIAL DATA
// ─────────────────────────────────────────────

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'car_wash', name: 'Car Wash', category: 'Automotive',
    description: 'A basic automated car wash. Tap to manually clean vehicles for extra capital.',
    cost: 80, costMultiplier: 1.14, income: 1,
    count: 0, level: 1, upgradeCost: 400,
    maxEmployees: 2, employees: [],
    managerCost: 500, managerHired: false,
    icon: 'car', image: 'taxi_biz', unlockAt: 0,
  },
  {
    id: 'retail', name: 'Retail Store', category: 'Commerce',
    description: 'A local shop selling everyday goods. The perfect starting point for any tycoon.',
    cost: 200, costMultiplier: 1.15, income: 3,
    count: 0, level: 1, upgradeCost: 1000,
    maxEmployees: 2, employees: [],
    managerCost: 1500, managerHired: false,
    icon: 'shopping-bag', image: 'retail_biz', unlockAt: 0,
  },
  {
    id: 'taxi', name: 'Taxi Company', category: 'Transport',
    description: 'Run a fleet of taxis across the city. Buy economy, comfort, and business vehicles.',
    cost: 1500, costMultiplier: 1.16, income: 12,
    count: 0, level: 1, upgradeCost: 7500,
    maxEmployees: 3, employees: [],
    managerCost: 9000, managerHired: false,
    icon: 'car', image: 'taxi_biz', unlockAt: 0,
  },
  {
    id: 'logistics', name: 'Shipping Company', category: 'Transport',
    description: 'Oversee cargo routes and supply chains across the country.',
    cost: 10000, costMultiplier: 1.18, income: 85,
    count: 0, level: 1, upgradeCost: 50000,
    maxEmployees: 4, employees: [],
    managerCost: 60000, managerHired: false,
    icon: 'truck', image: 'logistics_biz', unlockAt: 5000,
  },
  {
    id: 'cinema', name: 'Cinema Theater', category: 'Commerce',
    description: 'Schedule blockbuster movies, sell popcorn, and entertain the city.',
    cost: 35000, costMultiplier: 1.19, income: 320,
    count: 0, level: 1, upgradeCost: 150000,
    maxEmployees: 4, employees: [],
    managerCost: 180000, managerHired: false,
    icon: 'film', image: 'startup_biz', unlockAt: 15000,
  },
  {
    id: 'factory', name: 'Steel Factory', category: 'Heavy Industry',
    description: 'A manufacturing powerhouse producing steel and components.',
    cost: 95000, costMultiplier: 1.20, income: 950,
    count: 0, level: 1, upgradeCost: 300000,
    maxEmployees: 5, employees: [],
    managerCost: 400000, managerHired: false,
    icon: 'hammer', image: 'foundry_biz', unlockAt: 40000,
  },
  {
    id: 'construction', name: 'Construction Company', category: 'Construction',
    description: 'Build skyscrapers, bridges, and entire city blocks for massive contracts.',
    cost: 250000, costMultiplier: 1.21, income: 2500,
    count: 0, level: 1, upgradeCost: 1250000,
    maxEmployees: 6, employees: [],
    managerCost: 2000000, managerHired: false,
    icon: 'building-2', image: 'construction_biz', unlockAt: 150000,
  },
  {
    id: 'car_dealership', name: 'Car Dealership', category: 'Automotive',
    description: 'Sell luxury and economy vehicles. Clean margins on flipping cars.',
    cost: 1000000, costMultiplier: 1.22, income: 10000,
    count: 0, level: 1, upgradeCost: 5000000,
    maxEmployees: 6, employees: [],
    managerCost: 8000000, managerHired: false,
    icon: 'car', image: 'car_dealership_biz', unlockAt: 600000,
  },
  {
    id: 'it_company', name: 'IT Company', category: 'Technology',
    description: 'Develop software, apps and enterprise solutions. Start software projects.',
    cost: 4000000, costMultiplier: 1.23, income: 40000,
    count: 0, level: 1, upgradeCost: 20000000,
    maxEmployees: 8, employees: [],
    managerCost: 35000000, managerHired: false,
    icon: 'cpu', image: 'it_company_biz', unlockAt: 2500000,
  },
  {
    id: 'bank', name: 'Private Bank', category: 'Finance',
    description: 'The cornerstone of wealth. Configure Loan & Deposit rates to control vault fund.',
    cost: 15000000, costMultiplier: 1.25, income: 175000,
    count: 0, level: 1, upgradeCost: 80000000,
    maxEmployees: 8, employees: [],
    managerCost: 150000000, managerHired: false,
    icon: 'landmark', image: 'bank_biz', unlockAt: 10000000,
    bankVaultFund: 0, bankVaultCapacity: 100000000,
    depositRate: 1.0, loanRate: 1.0,
  },
  {
    id: 'football_club', name: 'Football Club', category: 'Sports',
    description: 'Own a Premier League club. Ticket sales, sponsorships and merchandise print money.',
    cost: 60000000, costMultiplier: 1.26, income: 700000,
    count: 0, level: 1, upgradeCost: 300000000,
    maxEmployees: 10, employees: [],
    managerCost: 600000000, managerHired: false,
    icon: 'trophy', image: 'football_club_biz', unlockAt: 40000000,
  },
  {
    id: 'clothing_brand', name: 'Clothing Brand', category: 'Fashion',
    description: 'Launch a global luxury fashion brand. Prestige and profit in equal measure.',
    cost: 200000000, costMultiplier: 1.27, income: 2500000,
    count: 0, level: 1, upgradeCost: 1000000000,
    maxEmployees: 10, employees: [],
    managerCost: 2000000000, managerHired: false,
    icon: 'shirt', image: 'clothing_brand_biz', unlockAt: 150000000,
  },
  {
    id: 'airlines', name: 'Airlines', category: 'Aviation',
    description: 'Operate international flight routes with your own fleet of aircraft.',
    cost: 500000000, costMultiplier: 1.28, income: 6500000,
    count: 0, level: 1, upgradeCost: 2500000000,
    maxEmployees: 12, employees: [],
    managerCost: 5000000000, managerHired: false,
    icon: 'plane', image: 'airlines_biz', unlockAt: 400000000,
  },
  {
    id: 'oil_gas', name: 'Oil & Gas Company', category: 'Energy',
    description: 'Extract and trade crude oil globally. Massive limits and incredible passive income.',
    cost: 2000000000, costMultiplier: 1.30, income: 28000000,
    count: 0, level: 1, upgradeCost: 10000000000,
    maxEmployees: 14, employees: [],
    managerCost: 20000000000, managerHired: false,
    icon: 'flame', image: 'oil_gas_biz', unlockAt: 1500000000,
  },
  {
    id: 'space_agency', name: 'Space Agency', category: 'Aerospace',
    description: 'Launch satellites, sell orbital data and pioneer commercial spaceflight.',
    cost: 10000000000, costMultiplier: 1.32, income: 150000000,
    count: 0, level: 1, upgradeCost: 50000000000,
    maxEmployees: 16, employees: [],
    managerCost: 100000000000, managerHired: false,
    icon: 'rocket', image: 'space_agency_biz', unlockAt: 8000000000,
  },
  {
    id: 'holding', name: 'Global Holding', category: 'Conglomerate',
    description: 'A diversified empire of companies. The pinnacle of business dominance.',
    cost: 50000000000, costMultiplier: 1.35, income: 800000000,
    count: 0, level: 1, upgradeCost: 250000000000,
    maxEmployees: 20, employees: [],
    managerCost: 500000000000, managerHired: false,
    icon: 'globe', image: 'holding_biz', unlockAt: 40000000000,
  },
];

const INITIAL_STOCKS: Stock[] = [
  { symbol: 'APEX', name: 'Apex Corp', currentPrice: 120, history: [120, 118, 122, 121, 125, 123, 120, 122, 124, 123], volatility: 0.04, sharesOwned: 0, avgBuyPrice: 0 },
  { symbol: 'ZENL', name: 'Zenith Logistics', currentPrice: 280, history: [290, 285, 280, 282, 278, 284, 288, 281, 285, 280], volatility: 0.03, sharesOwned: 0, avgBuyPrice: 0 },
  { symbol: 'NOVA', name: 'Nova Energy', currentPrice: 45, history: [40, 42, 41, 43, 44, 45, 43, 42, 44, 45], volatility: 0.06, sharesOwned: 0, avgBuyPrice: 0 },
  { symbol: 'QNTM', name: 'Quantum Computing', currentPrice: 650, history: [630, 640, 642, 638, 645, 650, 648, 652, 655, 650], volatility: 0.05, sharesOwned: 0, avgBuyPrice: 0 },
  { symbol: 'VIRT', name: 'VirtuMedia', currentPrice: 85, history: [92, 88, 81, 79, 84, 87, 91, 89, 83, 85], volatility: 0.08, sharesOwned: 0, avgBuyPrice: 0 },
  { symbol: 'BANK', name: 'GlobalBank Inc', currentPrice: 340, history: [320, 325, 330, 332, 338, 340, 337, 342, 345, 340], volatility: 0.025, sharesOwned: 0, avgBuyPrice: 0 },
];

const INITIAL_CRYPTO: Crypto[] = [
  { symbol: 'BTC', name: 'Bitcoin', currentPrice: 67000, history: [65000, 66000, 67500, 66800, 68000, 67000, 69000, 67500, 68500, 67000], volatility: 0.08, coinsOwned: 0, avgBuyPrice: 0, icon: 'bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', currentPrice: 3500, history: [3300, 3400, 3600, 3500, 3700, 3500, 3800, 3600, 3550, 3500], volatility: 0.10, coinsOwned: 0, avgBuyPrice: 0, icon: 'diamond', color: '#627EEA' },
  { symbol: 'BNB', name: 'BNB Chain', currentPrice: 580, history: [550, 560, 590, 580, 600, 580, 610, 590, 585, 580], volatility: 0.12, coinsOwned: 0, avgBuyPrice: 0, icon: 'hexagon', color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', currentPrice: 175, history: [160, 165, 180, 175, 185, 175, 190, 178, 172, 175], volatility: 0.15, coinsOwned: 0, avgBuyPrice: 0, icon: 'sun', color: '#9945FF' },
  { symbol: 'DOGE', name: 'Dogecoin', currentPrice: 0.18, history: [0.15, 0.17, 0.19, 0.18, 0.20, 0.18, 0.22, 0.19, 0.17, 0.18], volatility: 0.20, coinsOwned: 0, avgBuyPrice: 0, icon: 'smile', color: '#C2A633' },
];
// Loaded from @/constants/initialData instead

const INITIAL_NFTS: NFTAsset[] = [
  { id: 'bored_ape', name: 'Bored Ape Clone #4920', costETH: 15, prestige: 1200, count: 0, icon: 'smile', color: '#F7931A' },
  { id: 'cryptopunk', name: 'Punk Pixel Clone #883', costETH: 65, prestige: 6000, count: 0, icon: 'smile', color: '#627EEA' },
  { id: 'gold_yacht_nft', name: 'Golden Yacht NFT Collectible', costETH: 280, prestige: 29000, count: 0, icon: 'ship', color: '#F3BA2F' },
  { id: 'space_shuttle_nft', name: 'Pixel Shuttle Space NFT', costETH: 950, prestige: 110000, count: 0, icon: 'rocket', color: '#9945FF' },
];

const INITIAL_FLIPPED_CARS: FlippedCar[] = [
  { id: 'car_1', name: 'Battered Hatchback', class: 'economy', buyPrice: 10000, repairCost: 2000, repairTime: 8, repairProgress: 0, sellPrice: 16500, status: 'buyable' },
  { id: 'car_2', name: 'Dented Executive Sedan', class: 'medium', buyPrice: 75000, repairCost: 12000, repairTime: 18, repairProgress: 0, sellPrice: 112000, status: 'buyable' },
  { id: 'car_3', name: 'Scratched Supercar', class: 'luxury', buyPrice: 850000, repairCost: 110000, repairTime: 40, repairProgress: 0, sellPrice: 1350000, status: 'buyable' },
];

const INITIAL_IT_PROJECTS: ITProject[] = [
  { id: 'it_proj_1', name: 'Hyperlocal Delivery Mobile App', cost: 50000, payout: 95000, duration: 15, progress: 0, reqJunior: 1, reqMid: 0, reqSenior: 0, status: 'idle' },
  { id: 'it_proj_2', name: 'Corporate E-commerce Web Hub', cost: 240000, payout: 470000, duration: 32, progress: 0, reqJunior: 1, reqMid: 1, reqSenior: 0, status: 'idle' },
  { id: 'it_proj_3', name: 'Enterprise Cloud ERP Platform', cost: 1600000, payout: 3100000, duration: 55, progress: 0, reqJunior: 0, reqMid: 2, reqSenior: 1, status: 'idle' },
  { id: 'it_proj_4', name: 'Next-Gen Operating System Kernel', cost: 4300000, payout: 9200000, duration: 110, progress: 0, reqJunior: 2, reqMid: 2, reqSenior: 2, status: 'idle' },
  { id: 'it_proj_5', name: 'Decentralized AI Web-Search Protocol', cost: 12000000, payout: 28000000, duration: 180, progress: 0, reqJunior: 1, reqMid: 3, reqSenior: 2, status: 'idle' },
  { id: 'it_proj_6', name: 'Global Quantum Satellite Communication Network', cost: 45000000, payout: 115000000, duration: 360, progress: 0, reqJunior: 2, reqMid: 4, reqSenior: 3, status: 'idle' },
  { id: 'it_proj_7', name: 'Metaverse Neural Core Platform', cost: 150000000, payout: 420000000, duration: 720, progress: 0, reqJunior: 3, reqMid: 5, reqSenior: 5, status: 'idle' },
];

const INITIAL_CONSTRUCTION_PROJECTS: SkyscraperProject[] = [
  { id: 'sky_proj_1', name: 'Residential Suburbs Complex', cost: 8000000, payout: 26000000, duration: 45, progress: 0, status: 'idle' },
  { id: 'sky_proj_2', name: 'Downtown Financial Center Tower', cost: 42000000, payout: 145000000, duration: 90, progress: 0, status: 'idle' },
  { id: 'sky_proj_3', name: 'Megapolis Landmark Supertall Sky-Spire', cost: 180000000, payout: 620000000, duration: 180, progress: 0, status: 'idle' },
  { id: 'sky_proj_4', name: 'Smart Eco-City District', cost: 500000000, payout: 1850000000, duration: 300, progress: 0, status: 'idle' },
  { id: 'sky_proj_5', name: 'Oceanic Floating Metacity Complex', cost: 2500000000, payout: 9800000000, duration: 600, progress: 0, status: 'idle' },
  { id: 'sky_proj_6', name: 'Orbital Space Elevator Base Terminus', cost: 12000000000, payout: 54000000000, duration: 1200, progress: 0, status: 'idle' },
];

export const ACHIEVEMENT_DEFINITIONS: {
  id: string;
  titleEn: string;
  titleRu: string;
  descEn: string;
  descRu: string;
  icon: string;
  condition: (state: GameState) => boolean;
}[] = [
  { id: 'first_business', titleEn: 'First Steps', titleRu: 'Первые шаги', descEn: 'Purchase your first business', descRu: 'Купите свое первое предприятие', icon: 'briefcase', condition: (s) => s.businesses.some(b => b.count > 0) },
  { id: 'six_slots', titleEn: 'Full Slots Tycoon', titleRu: 'Магнат на все слоты', descEn: 'Fill all 6 business slots', descRu: 'Заполните все 6 слотов бизнеса', icon: 'store', condition: (s) => s.businesses.filter(b => b.count > 0).length >= 6 },
  { id: 'first_employee', titleEn: 'Employer', titleRu: 'Работодатель', descEn: 'Hire your first employee', descRu: 'Наймите первого сотрудника', icon: 'user-plus', condition: (s) => s.businesses.some(b => b.employees.length > 0) },
  { id: 'capital_1m', titleEn: 'Millionaire', titleRu: 'Миллионер', descEn: 'Accumulate $1,000,000', descRu: 'Накопите $1,000,000', icon: 'badge-dollar-sign', condition: (s) => s.capital >= 1000000 },
  { id: 'capital_1b', titleEn: 'Billionaire', titleRu: 'Миллиардер', descEn: 'Accumulate $1,000,000,000', descRu: 'Накопите $1,000,000,000', icon: 'gem', condition: (s) => s.capital >= 1000000000 },
  { id: 'capital_1t', titleEn: 'Trillionaire', titleRu: 'Триллионер', descEn: 'Accumulate $1,000,000,000,000', descRu: 'Накопите $1,000,000,000,000', icon: 'star', condition: (s) => s.capital >= 1000000000000 },
  { id: 'first_stock', titleEn: 'Investor', titleRu: 'Инвестор', descEn: 'Buy your first stock shares', descRu: 'Купите первые акции на бирже', icon: 'trending-up', condition: (s) => s.stocks.some(st => st.sharesOwned > 0) },
  { id: 'first_crypto', titleEn: 'Crypto Degen', titleRu: 'Крипто-деген', descEn: 'Buy your first cryptocurrency', descRu: 'Купите свою первую криптовалюту', icon: 'bitcoin', condition: (s) => s.crypto.some(c => c.coinsOwned > 0) },
  { id: 'first_real_estate', titleEn: 'Landlord', titleRu: 'Арендодатель', descEn: 'Purchase your first property', descRu: 'Купите свою первую недвижимость', icon: 'home', condition: (s) => s.realEstate.some(r => r.count > 0) },
  { id: 'first_luxury', titleEn: 'Living Luxuriously', titleRu: 'Роскошная жизнь', descEn: 'Purchase your first luxury item', descRu: 'Приобретите первый предмет роскоши', icon: 'sparkles', condition: (s) => s.luxury.some(l => l.count > 0) },
  { id: 'first_nft', titleEn: 'Crypto Art Collector', titleRu: 'Коллекционер NFT', descEn: 'Own your first rare NFT art piece', descRu: 'Станьте владельцем редкого NFT арта', icon: 'award', condition: (s) => s.nfts.some(n => n.count > 0) },
  { id: 'first_holding', titleEn: 'Global Monopolist', titleRu: 'Глобальный монополист', descEn: 'Form your first Holding Company', descRu: 'Создайте свой первый Холдинг', icon: 'shield-check', condition: (s) => s.businesses.find(b => b.id === 'holding')?.count ? s.businesses.find(b => b.id === 'holding')!.count > 0 : false },
  { id: 'first_car_flip', titleEn: 'Car Mechanic Specialist', titleRu: 'Автомеханик-эксперт', descEn: 'Sell a fully repaired flipped car', descRu: 'Успешно отремонтируйте и продайте машину', icon: 'car', condition: (s) => (s.carsFlippedCount || 0) > 0 },
  { id: 'click_commander', titleEn: 'Click Commander', titleRu: 'Командир кликов', descEn: 'Tap the Central Bank Vault 100 times', descRu: 'Нажмите на сейф ЦБ 100 раз', icon: 'star', condition: (s) => (s.totalClicks || 0) >= 100 },
  { id: 'crypto_baron', titleEn: 'Crypto Baron', titleRu: 'Крипто-барон', descEn: 'Own over 10 Bitcoins (BTC)', descRu: 'Имейте на балансе более 10 Bitcoin (BTC)', icon: 'bitcoin', condition: (s) => s.crypto.find(c => c.symbol === 'BTC')?.coinsOwned ? s.crypto.find(c => c.symbol === 'BTC')!.coinsOwned >= 10 : false },
  { id: 'sky_builder', titleEn: 'Sky Builder', titleRu: 'Небесный строитель', descEn: 'Successfully build your first Skyscraper project', descRu: 'Успешно завершите строительство небоскреба', icon: 'home', condition: (s) => s.skyscraperProjects.some(p => p.status === 'completed') },
  { id: 'mars_settler', titleEn: 'Mars Settler', titleRu: 'Колонизатор Марса', descEn: 'Launch a Space Agency mission to Mars', descRu: 'Успешно запустите космическую миссию на Марс', icon: 'star', condition: (s) => s.prestige >= 2500 },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = ACHIEVEMENT_DEFINITIONS.map(def => ({
  id: def.id,
  title: def.titleEn,
  description: def.descEn,
  titleEn: def.titleEn,
  titleRu: def.titleRu,
  descEn: def.descEn,
  descRu: def.descRu,
  icon: def.icon,
  unlocked: false,
}));

// ─────────────────────────────────────────────
//  STORE
// ─────────────────────────────────────────────

export function getBoostedBusinessIncome(b: Business, rdUpgrades: Record<string, boolean>): number {
  if (b.count === 0) return 0;

  if (b.id === 'bank') {
    const depositRate = b.depositRate ?? 1.0;
    const loanRate = b.loanRate ?? 1.0;
    const vaultFund = b.bankVaultFund ?? 0;
    const grossEarn = vaultFund * (loanRate * 0.00002) * b.count;
    const costPay = vaultFund * (depositRate * 0.000015) * b.count;
    let bankProfit = grossEarn - costPay;
    if (rdUpgrades && rdUpgrades['rd_hft_algorithms']) {
      bankProfit *= 1.30;
    }
    return Math.min(277778, bankProfit);
  }

  if (b.id === 'holding') {
    return b.count * 2416666 * b.level;
  }
  if (b.id === 'space_agency') {
    let base = b.count * 150000000 * b.level;
    if (rdUpgrades && rdUpgrades['rd_fusion_propulsion']) {
      base *= 1.50;
    }
    return base;
  }
  if (b.id === 'oil_gas') {
    let base = b.count * 28000000 * b.level;
    if (rdUpgrades && rdUpgrades['rd_quantum_sensor']) {
      base *= 1.40;
    }
    return base;
  }

  const employeeSalary = b.employees.reduce((sumCost, e) => sumCost + e.salary, 0);
  if (b.id === 'car_dealership' || b.id === 'it_company' || b.id === 'construction') {
    return -employeeSalary;
  }

  const managerMult = b.managerHired ? 2.0 : 1.0;
  const employeeBonus = b.employees.reduce((s, e) => s + e.skill / 100, 0);
  let rawIncome = b.count * b.income * managerMult * (1 + employeeBonus);

  if (b.id === 'retail' && rdUpgrades && rdUpgrades['rd_cloud_integration']) {
    rawIncome *= 1.25;
  } else if ((b.id === 'factory' || b.id === 'car_wash') && rdUpgrades && rdUpgrades['rd_ai_automation']) {
    rawIncome *= 1.30;
  } else if ((b.id === 'taxi' || b.id === 'logistics') && rdUpgrades && rdUpgrades['rd_clean_energy']) {
    rawIncome *= 1.25;
  }

  return rawIncome - employeeSalary;
}

export function getClickReward(level: number): number {
  const rewards = [1, 10, 50, 250, 1000, 5000, 25000, 100000, 500000, 2500000];
  return rewards[Math.min(level, 10) - 1] ?? 1;
}

export function getClickUpgradeCost(level: number): number {
  const costs = [500, 2500, 10000, 50000, 250000, 1250000, 6000000, 30000000, 150000000, 1000000000];
  return costs[Math.min(level, 10) - 1] ?? 999999999999;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      capital: 1000,
      totalEarned: 1000,
      prestige: 0,
      netWorth: 1000,
      lastActive: Date.now(),
      offlineEarnings: 0,

      // Settings & Upgrades
      language: 'en',
      themeOverride: 'system',
      clickPowerLevel: 1,

      // New state fields
      carsFlippedCount: 0,
      totalClicks: 0,
      rdUpgrades: {},

      businesses: INITIAL_BUSINESSES,
      stocks: INITIAL_STOCKS,
      crypto: INITIAL_CRYPTO,
      realEstate: INITIAL_REAL_ESTATE,
      luxury: INITIAL_LUXURY,
      nfts: INITIAL_NFTS,
      achievements: INITIAL_ACHIEVEMENTS,

      flippedCars: INITIAL_FLIPPED_CARS,
      itProjects: INITIAL_IT_PROJECTS,
      skyscraperProjects: INITIAL_CONSTRUCTION_PROJECTS,

      dailyRewardStreak: 0,
      lastDailyRewardClaimed: 0,

      // Interactive states
      itCompanyIPO_Launched: false,
      activeLoans: [],
      cinemaMovieActive: null,
      cinemaMovieDuration: 0,
      cinemaMovieProgress: 0,
      airlineRoutes: [
        { id: 'route_ny_london', name: 'New York (JFK) ➔ London (LHR)', distance: 5500, cost: 5000000, income: 15000, purchased: false },
        { id: 'route_tokyo_la', name: 'Tokyo (HND) ➔ Los Angeles (LAX)', distance: 8800, cost: 12000000, income: 42000, purchased: false },
        { id: 'route_paris_sydney', name: 'Paris (CDG) ➔ Sydney (SYD)', distance: 17000, cost: 35000000, income: 145000, purchased: false },
      ],
      taxiFleet: { economy: 0, comfort: 0, business: 0 },
      carWashManualUpgrade: 1,

      // New Interactive states
      // Football Club
      fcPlayers: [],
      fcTrainingLevel: 1,
      fcMatchActive: false,
      fcMatchTimer: 0,
      fcOpponentRating: 0,
      fcMatchLog: '',
      // Clothing Brand
      clothingCollectionActive: false,
      clothingCollectionName: '',
      clothingCollectionProgress: 0,
      clothingCollectionDuration: 0,
      clothingCollectionQuality: 0,
      // Oil & Gas
      oilWellsCount: 0,
      oilPrice: 65.0, // base price per barrel
      oilReserve: 0,
      // Space Agency
      spaceMissionActive: false,
      spaceMissionDestination: null,
      spaceMissionProgress: 0,
      spaceMissionDuration: 0,
      spaceMissionSuccessRate: 0,
      spaceMissionLog: '',

      setLanguage: (lang) => set({ language: lang }),
      setThemeOverride: (theme) => set({ themeOverride: theme }),
      upgradeClickPower: () => {
        set((state) => {
          const cost = getClickUpgradeCost(state.clickPowerLevel);
          if (state.capital < cost || state.clickPowerLevel >= 10) return {};
          return {
            capital: state.capital - cost,
            clickPowerLevel: state.clickPowerLevel + 1,
            lastActive: Date.now(),
          };
        });
      },
      cheatAddMoney: (amount) => {
        set((state) => ({
          capital: state.capital + amount,
          totalEarned: state.totalEarned + amount,
          lastActive: Date.now(),
        }));
      },

      buyRDUpgrade: (id: string) => {
        set((state) => {
          const RD_UPGRADES_LIST: Record<string, number> = {
            rd_cloud_integration: 10000000,
            rd_ai_automation: 50000000,
            rd_clean_energy: 250000000,
            rd_hft_algorithms: 1000000000,
            rd_quantum_sensor: 8000000000,
            rd_fusion_propulsion: 50000000000,
            rd_neural_dial: 5000000,
          };
          const cost = RD_UPGRADES_LIST[id] ?? 0;
          const userUpgrades = state.rdUpgrades || {};
          if (state.capital < cost || userUpgrades[id]) return {};
          return {
            capital: state.capital - cost,
            rdUpgrades: { ...userUpgrades, [id]: true },
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      speedUpITProject: (projectId: string) => {
        set((state) => {
          const proj = state.itProjects.find(p => p.id === projectId);
          if (!proj || proj.status !== 'running') return {};
          const remainingSeconds = proj.duration - proj.progress;
          if (remainingSeconds <= 0) return {};
          const cost = Math.round(remainingSeconds * (proj.payout / proj.duration) * 1.5);
          if (state.capital < cost) return {};
          
          return {
            capital: state.capital - cost + proj.payout,
            totalEarned: state.totalEarned - cost + proj.payout,
            itProjects: state.itProjects.map(p => p.id === projectId ? { ...p, progress: 0, status: 'completed' as const } : p),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      speedUpSkyscraper: (projectId: string) => {
        set((state) => {
          const proj = state.skyscraperProjects.find(p => p.id === projectId);
          if (!proj || proj.status !== 'building') return {};
          const remainingSeconds = proj.duration - proj.progress;
          if (remainingSeconds <= 0) return {};
          const cost = Math.round(remainingSeconds * (proj.payout / proj.duration) * 1.5);
          if (state.capital < cost) return {};
          
          return {
            capital: state.capital - cost + proj.payout,
            totalEarned: state.totalEarned - cost + proj.payout,
            skyscraperProjects: state.skyscraperProjects.map(p => p.id === projectId ? { ...p, progress: 0, status: 'completed' as const } : p),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      speedUpCinemaScreening: () => {
        set((state) => {
          if (!state.cinemaMovieActive) return {};
          const remainingSeconds = state.cinemaMovieDuration - state.cinemaMovieProgress;
          if (remainingSeconds <= 0) return {};
          const cinema = state.businesses.find(b => b.id === 'cinema');
          const count = cinema ? cinema.count : 0;
          const level = cinema ? cinema.level : 1;
          const payout = 12000 * count * level;
          const cost = Math.round(remainingSeconds * (payout / state.cinemaMovieDuration) * 1.5);
          if (state.capital < cost) return {};
          
          return {
            capital: state.capital - cost + payout,
            totalEarned: state.totalEarned - cost + payout,
            cinemaMovieActive: null,
            cinemaMovieProgress: 0,
            cinemaMovieDuration: 0,
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      speedUpCarRepair: (carId: string) => {
        set((state) => {
          const car = state.flippedCars.find(c => c.id === carId);
          if (!car || car.status !== 'repairing') return {};
          const remainingSeconds = car.repairTime - car.repairProgress;
          if (remainingSeconds <= 0) return {};
          const cost = Math.round(remainingSeconds * (car.repairCost / car.repairTime) * 2) + 500;
          if (state.capital < cost) return {};
          
          return {
            capital: state.capital - cost,
            flippedCars: state.flippedCars.map(c => c.id === carId ? { ...c, repairProgress: c.repairTime, status: 'repaired' as const } : c),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      washCarManually: () => {
        set((state) => {
          const reward = 15 * state.carWashManualUpgrade;
          return {
            capital: state.capital + reward,
            totalEarned: state.totalEarned + reward,
            lastActive: Date.now(),
          };
        });
      },
      upgradeCarWashSoap: () => {
        set((state) => {
          const cost = Math.round(150 * Math.pow(2.2, state.carWashManualUpgrade));
          if (state.capital < cost) return {};
          return {
            capital: state.capital - cost,
            carWashManualUpgrade: state.carWashManualUpgrade + 1,
            lastActive: Date.now(),
          };
        });
      },
      scheduleMovie: (title: string, duration: number, fee: number) => {
        set((state) => {
          if (state.capital < fee || state.cinemaMovieActive) return {};
          return {
            capital: state.capital - fee,
            cinemaMovieActive: title,
            cinemaMovieDuration: duration,
            cinemaMovieProgress: 0,
            lastActive: Date.now(),
          };
        });
      },
      buyTaxiCar: (carClass: 'economy' | 'comfort' | 'business', cost: number) => {
        set((state) => {
          if (state.capital < cost) return {};
          const nextFleet = { ...state.taxiFleet, [carClass]: state.taxiFleet[carClass] + 1 };
          return {
            capital: state.capital - cost,
            taxiFleet: nextFleet,
            lastActive: Date.now(),
          };
        });
      },
      approveLoanRequest: (amount: number, interestRate: number, risk: number, duration: number) => {
        set((state) => {
          const bank = state.businesses.find(b => b.id === 'bank');
          const vaultFund = bank ? (bank.bankVaultFund ?? 0) : 0;
          if (vaultFund < amount) return {};
          
          const paymentPerSecond = Math.round((amount * (1 + interestRate / 100)) / duration);
          const newLoan = {
            id: `loan_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            applicant: randomName(),
            amount,
            interestRate,
            risk,
            duration,
            totalDuration: duration,
            paymentPerSecond,
          };

          return {
            businesses: state.businesses.map(b => b.id === 'bank' ? { ...b, bankVaultFund: vaultFund - amount } : b),
            activeLoans: [...state.activeLoans, newLoan],
            lastActive: Date.now(),
          };
        });
      },
      buyAirlineRoute: (routeId: string) => {
        set((state) => {
          const route = state.airlineRoutes.find(r => r.id === routeId);
          if (!route || route.purchased || state.capital < route.cost) return {};
          return {
            capital: state.capital - route.cost,
            airlineRoutes: state.airlineRoutes.map(r => r.id === routeId ? { ...r, purchased: true } : r),
            lastActive: Date.now(),
          };
        });
      },
      launchITIPO: () => {
        set((state) => {
          if (state.itCompanyIPO_Launched) return {};
          
          const itcoStock = {
            symbol: 'ITCO',
            name: 'IT Company Inc.',
            currentPrice: 150.00,
            history: [150, 148, 152, 155, 151, 156, 160, 158, 162, 165],
            volatility: 0.05,
            sharesOwned: 10000,
            avgBuyPrice: 0.0,
          };
          
          return {
            itCompanyIPO_Launched: true,
            capital: state.capital + 15000000,
            totalEarned: state.totalEarned + 15000000,
            stocks: [...state.stocks, itcoStock],
            lastActive: Date.now(),
          };
        });
      },
      recruitFootballPlayer: () => {
        set((state) => {
          const club = state.businesses.find(b => b.id === 'football_club');
          if (!club || club.count === 0) return {};
          
          // Cost is rating * 150000
          const rating = Math.floor(45 + Math.random() * 54);
          const cost = rating * 180000;
          if (state.capital < cost) return {};

          const names = ['Cristiano Rossi','Lionel Chen','Neymar Santos','Kylian Ivanov','Kevin Lee','Mohamed Müller','Erling Kim','Luka Patel','Robert Williams','Marcus Taylor'];
          const newPlayer = {
            id: `player_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            name: names[Math.floor(Math.random() * names.length)],
            rating,
            cost,
          };

          return {
            capital: state.capital - cost,
            fcPlayers: [...state.fcPlayers.slice(-10), newPlayer], // keep up to 11 players
            lastActive: Date.now(),
          };
        });
      },

      trainFootballSquad: () => {
        set((state) => {
          const cost = state.fcTrainingLevel * 2500000;
          if (state.capital < cost) return {};
          return {
            capital: state.capital - cost,
            fcTrainingLevel: state.fcTrainingLevel + 1,
            lastActive: Date.now(),
          };
        });
      },

      startFootballMatch: (opponentRating, reward) => {
        set((state) => {
          if (state.fcMatchActive) return {};
          return {
            fcMatchActive: true,
            fcMatchTimer: 0,
            fcOpponentRating: opponentRating,
            fcMatchLog: 'Match kicked off! Intense tactical struggle on the pitch...',
            lastActive: Date.now(),
          };
        });
      },

      startClothingCollection: (name, budget, duration) => {
        set((state) => {
          const brand = state.businesses.find(b => b.id === 'clothing_brand');
          if (!brand || brand.count === 0 || state.clothingCollectionActive) return {};
          if (state.capital < budget) return {};

          // Quality is a factor of budget and brand level
          const quality = Math.min(100, Math.round((budget / 1000000) * 15 + brand.level * 5));

          return {
            capital: state.capital - budget,
            clothingCollectionActive: true,
            clothingCollectionName: name || 'Summer Chic',
            clothingCollectionProgress: 0,
            clothingCollectionDuration: duration,
            clothingCollectionQuality: quality,
            lastActive: Date.now(),
          };
        });
      },

      drillOilWell: () => {
        set((state) => {
          const oil = state.businesses.find(b => b.id === 'oil_gas');
          if (!oil || oil.count === 0) return {};
          
          const cost = (state.oilWellsCount + 1) * 8500000;
          if (state.capital < cost) return {};

          return {
            capital: state.capital - cost,
            oilWellsCount: state.oilWellsCount + 1,
            lastActive: Date.now(),
          };
        });
      },

      sellOilReserves: () => {
        set((state) => {
          if (state.oilReserve <= 0) return {};
          const revenue = Math.round(state.oilReserve * state.oilPrice);
          return {
            capital: state.capital + revenue,
            totalEarned: state.totalEarned + revenue,
            oilReserve: 0,
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      launchSpaceMission: (dest, cost, duration, rate) => {
        set((state) => {
          const agency = state.businesses.find(b => b.id === 'space_agency');
          if (!agency || agency.count === 0 || state.spaceMissionActive) return {};
          if (state.capital < cost) return {};

          return {
            capital: state.capital - cost,
            spaceMissionActive: true,
            spaceMissionDestination: dest,
            spaceMissionProgress: 0,
            spaceMissionDuration: duration,
            spaceMissionSuccessRate: rate,
            spaceMissionLog: `Rocket launched successfully towards ${dest.toUpperCase()}! Entering outer atmospheric trajectory...`,
            lastActive: Date.now(),
          };
        });
      },

      clickVault: () => {
        set((state) => {
          const baseReward = getClickReward(state.clickPowerLevel);
          const prestigeBonus = Math.floor(state.prestige / 500);
          let reward = baseReward + prestigeBonus;
          if (state.rdUpgrades && state.rdUpgrades['rd_neural_dial']) {
            reward *= 2;
          }
          return {
            capital: state.capital + reward,
            totalEarned: state.totalEarned + reward,
            totalClicks: (state.totalClicks || 0) + 1,
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      buyBusiness: (id: string) => {
        set((state) => {
          const target = state.businesses.find((b) => b.id === id);
          if (!target || state.capital < target.cost) return {};

          const activeCount = state.businesses.filter(b => b.count > 0).length;
          // Slots limit check (only if opening a brand new business)
          if (target.count === 0 && activeCount >= 6) {
            return {};
          }

          const updatedBusinesses = state.businesses.map((b) => {
            if (b.id !== id) return b;
            const nextCost = Math.round(b.cost * b.costMultiplier);
            return { ...b, count: b.count + 1, cost: nextCost };
          });

          return {
            capital: state.capital - target.cost,
            businesses: updatedBusinesses,
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      sellBusiness: (id: string) => {
        set((state) => {
          const target = state.businesses.find(b => b.id === id);
          if (!target || target.count === 0) return {};

          // Refund formula: 70% of current cost divided by multiplier, times count
          const refundAmount = Math.round((target.cost / target.costMultiplier) * target.count * 0.7);

          return {
            capital: state.capital + refundAmount,
            businesses: state.businesses.map(b =>
              b.id === id
                ? { ...b, count: 0, level: 1, upgradeCost: Math.round(b.cost / Math.pow(b.costMultiplier, b.count) * 5), employees: [], managerHired: false, customName: undefined }
                : b
            ),
            lastActive: Date.now(),
          };
        });
      },

      renameBusiness: (id: string, name: string) => {
        set((state) => ({
          businesses: state.businesses.map(b => b.id === id ? { ...b, customName: name } : b)
        }));
      },

      hireManager: (id: string) => {
        set((state) => {
          const target = state.businesses.find((b) => b.id === id);
          if (!target || target.managerHired || state.capital < target.managerCost) return {};
          return {
            capital: state.capital - target.managerCost,
            businesses: state.businesses.map((b) =>
              b.id === id ? { ...b, managerHired: true } : b
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      upgradeBusiness: (id: string) => {
        set((state) => {
          const target = state.businesses.find((b) => b.id === id);
          if (!target || target.level >= 10 || state.capital < target.upgradeCost) return {};
          const newLevel = target.level + 1;
          const newIncome = Math.round(target.income * 1.25);
          const newUpgradeCost = Math.round(target.upgradeCost * 3.5);
          const newMaxEmployees = target.maxEmployees + 2;

          return {
            capital: state.capital - target.upgradeCost,
            businesses: state.businesses.map((b) =>
              b.id === id
                ? { ...b, level: newLevel, income: newIncome, upgradeCost: newUpgradeCost, maxEmployees: newMaxEmployees }
                : b
            ),
            lastActive: Date.now(),
          };
        });
      },

      hireEmployee: (businessId: string) => {
        set((state) => {
          const business = state.businesses.find(b => b.id === businessId);
          if (!business || business.count === 0) return {};
          if (business.employees.length >= business.maxEmployees) return {};

          const candidate = generateCandidate(business.income * business.count, business.level);
          const hireBonus = candidate.salary * 20; // upfront cost = 20s of salary
          if (state.capital < hireBonus) return {};

          return {
            capital: state.capital - hireBonus,
            businesses: state.businesses.map(b =>
              b.id === businessId
                ? { ...b, employees: [...b.employees, candidate] }
                : b
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      fireEmployee: (businessId: string, employeeId: string) => {
        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === businessId
              ? { ...b, employees: b.employees.filter(e => e.id !== employeeId) }
              : b
          ),
          lastActive: Date.now(),
        }));
      },

      setBankRates: (id: string, depositRate: number, loanRate: number) => {
        set((state) => ({
          businesses: state.businesses.map(b =>
            b.id === id
              ? { ...b, depositRate, loanRate }
              : b
          ),
          lastActive: Date.now(),
        }));
      },

      buyCarForFlipping: (carId: string) => {
        set((state) => {
          const car = state.flippedCars.find(c => c.id === carId);
          if (!car || car.status !== 'buyable' || state.capital < car.buyPrice) return {};
          return {
            capital: state.capital - car.buyPrice,
            flippedCars: state.flippedCars.map(c =>
              c.id === carId ? { ...c, status: 'repairing' as const, repairProgress: 0 } : c
            ),
            lastActive: Date.now(),
          };
        });
      },

      repairCar: (carId: string) => {
        set((state) => {
          const car = state.flippedCars.find(c => c.id === carId);
          if (!car || car.status !== 'repairing' || state.capital < car.repairCost) return {};
          return {
            capital: state.capital - car.repairCost,
            flippedCars: state.flippedCars.map(c =>
              c.id === carId ? { ...c, repairProgress: c.repairProgress + 0.1 } : c
            ),
            lastActive: Date.now(),
          };
        });
      },

      sellFlippedCar: (carId: string) => {
        set((state) => {
          const car = state.flippedCars.find(c => c.id === carId);
          if (!car || car.status !== 'repaired') return {};
          const nextCars = state.flippedCars.map(c => {
            if (c.id !== carId) return c;
            const priceMult = 0.9 + Math.random() * 0.2;
            const newBuyPrice = Math.round(c.buyPrice * priceMult);
            const newRepairCost = Math.round(c.repairCost * priceMult);
            const newSellPrice = Math.round(c.sellPrice * priceMult);
            return {
              ...c,
              buyPrice: newBuyPrice,
              repairCost: newRepairCost,
              sellPrice: newSellPrice,
              repairProgress: 0,
              status: 'buyable' as const,
            };
          });
          return {
            capital: state.capital + car.sellPrice,
            totalEarned: state.totalEarned + (car.sellPrice - car.buyPrice - car.repairCost),
            flippedCars: nextCars,
            carsFlippedCount: (state.carsFlippedCount || 0) + 1,
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      refreshFlippedCars: () => {
        set((state) => ({
          flippedCars: state.flippedCars.map(c => {
            if (c.status !== 'buyable') return c;
            const priceMult = 0.85 + Math.random() * 0.3;
            return {
              ...c,
              buyPrice: Math.round(c.buyPrice * priceMult),
              repairCost: Math.round(c.repairCost * priceMult),
              sellPrice: Math.round(c.sellPrice * priceMult),
            };
          }),
        }));
      },

      startITProject: (projectId: string) => {
        set((state) => {
          const project = state.itProjects.find(p => p.id === projectId);
          const itCompany = state.businesses.find(b => b.id === 'it_company');
          if (!project || project.status === 'running' || !itCompany || itCompany.count === 0) return {};

          const juniors = itCompany.employees.filter(e => e.role === 'junior').length;
          const mids = itCompany.employees.filter(e => e.role === 'mid').length;
          const seniors = itCompany.employees.filter(e => e.role === 'senior').length + itCompany.employees.filter(e => e.role === 'executive').length;

          if (juniors < project.reqJunior || mids < project.reqMid || seniors < project.reqSenior) {
            return {};
          }

          return {
            capital: state.capital - project.cost,
            itProjects: state.itProjects.map(p =>
              p.id === projectId ? { ...p, status: 'running' as const, progress: 0 } : p
            ),
            lastActive: Date.now(),
          };
        });
      },

      startSkyscraper: (projectId: string) => {
        set((state) => {
          const project = state.skyscraperProjects.find(p => p.id === projectId);
          const constructionCompany = state.businesses.find(b => b.id === 'construction');
          if (!project || project.status === 'building' || !constructionCompany || constructionCompany.count === 0) return {};
          if (state.capital < project.cost) return {};

          return {
            capital: state.capital - project.cost,
            skyscraperProjects: state.skyscraperProjects.map(p =>
              p.id === projectId ? { ...p, status: 'building' as const, progress: 0 } : p
            ),
            lastActive: Date.now(),
          };
        });
      },

      buyStock: (symbol: string, shares: number) => {
        set((state) => {
          const target = state.stocks.find((s) => s.symbol === symbol);
          if (!target) return {};
          const totalCost = target.currentPrice * shares;
          if (state.capital < totalCost) return {};
          const totalShares = target.sharesOwned + shares;
          const avgBuyPrice = ((target.avgBuyPrice * target.sharesOwned) + totalCost) / totalShares;
          return {
            capital: state.capital - totalCost,
            stocks: state.stocks.map((s) =>
              s.symbol === symbol
                ? { ...s, sharesOwned: totalShares, avgBuyPrice: Math.round(avgBuyPrice * 100) / 100 }
                : s
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      sellStock: (symbol: string, shares: number) => {
        set((state) => {
          const target = state.stocks.find((s) => s.symbol === symbol);
          if (!target || target.sharesOwned < shares) return {};
          const revenue = target.currentPrice * shares;
          const remainingShares = target.sharesOwned - shares;
          return {
            capital: state.capital + revenue,
            totalEarned: state.totalEarned + Math.max(0, revenue - target.avgBuyPrice * shares),
            stocks: state.stocks.map((s) =>
              s.symbol === symbol
                ? { ...s, sharesOwned: remainingShares, avgBuyPrice: remainingShares === 0 ? 0 : s.avgBuyPrice }
                : s
            ),
            lastActive: Date.now(),
          };
        });
      },

      buyCrypto: (symbol: string, coins: number) => {
        set((state) => {
          const target = state.crypto.find(c => c.symbol === symbol);
          if (!target) return {};
          const totalCost = target.currentPrice * coins;
          if (state.capital < totalCost) return {};
          const totalCoins = target.coinsOwned + coins;
          const avgBuyPrice = ((target.avgBuyPrice * target.coinsOwned) + totalCost) / totalCoins;
          return {
            capital: state.capital - totalCost,
            crypto: state.crypto.map(c =>
              c.symbol === symbol
                ? { ...c, coinsOwned: totalCoins, avgBuyPrice: Math.round(avgBuyPrice * 1000) / 1000 }
                : c
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      sellCrypto: (symbol: string, coins: number) => {
        set((state) => {
          const target = state.crypto.find(c => c.symbol === symbol);
          if (!target || target.coinsOwned < coins) return {};
          const revenue = target.currentPrice * coins;
          const remainingCoins = target.coinsOwned - coins;
          return {
            capital: state.capital + revenue,
            totalEarned: state.totalEarned + Math.max(0, revenue - target.avgBuyPrice * coins),
            crypto: state.crypto.map(c =>
              c.symbol === symbol
                ? { ...c, coinsOwned: remainingCoins, avgBuyPrice: remainingCoins === 0 ? 0 : c.avgBuyPrice }
                : c
            ),
            lastActive: Date.now(),
          };
        });
      },

      buyRealEstate: (id: string) => {
        set((state) => {
          const target = state.realEstate.find((r) => r.id === id);
          if (!target || state.capital < target.cost) return {};
          return {
            capital: state.capital - target.cost,
            realEstate: state.realEstate.map((r) =>
              r.id === id ? { ...r, count: r.count + 1 } : r
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      upgradeProperty: (id: string) => {
        set((state) => {
          const target = state.realEstate.find(r => r.id === id);
          if (!target || target.count === 0 || target.upgradeLevel >= 5 || state.capital < target.upgradeCost) return {};
          const newLevel = target.upgradeLevel + 1;
          const newRent = Math.round(target.rent * 1.8);
          const newUpgradeCost = Math.round(target.upgradeCost * 2.5);

          return {
            capital: state.capital - target.upgradeCost,
            realEstate: state.realEstate.map(r =>
              r.id === id
                ? { ...r, upgradeLevel: newLevel, rent: newRent, upgradeCost: newUpgradeCost }
                : r
            ),
            lastActive: Date.now(),
          };
        });
      },

      buyLuxury: (id: string) => {
        set((state) => {
          const target = state.luxury.find((l) => l.id === id);
          if (!target || state.capital < target.cost) return {};
          return {
            capital: state.capital - target.cost,
            prestige: state.prestige + target.prestige,
            luxury: state.luxury.map((l) =>
              l.id === id ? { ...l, count: l.count + 1 } : l
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      buyNFT: (id: string) => {
        set((state) => {
          const target = state.nfts.find(n => n.id === id);
          const ethWallet = state.crypto.find(c => c.symbol === 'ETH');
          if (!target || !ethWallet || ethWallet.coinsOwned < target.costETH) return {};

          return {
            crypto: state.crypto.map(c =>
              c.symbol === 'ETH' ? { ...c, coinsOwned: c.coinsOwned - target.costETH } : c
            ),
            prestige: state.prestige + target.prestige,
            nfts: state.nfts.map(n =>
              n.id === id ? { ...n, count: n.count + 1 } : n
            ),
            lastActive: Date.now(),
          };
        });
        get().checkAchievements();
      },

      claimDailyReward: () => {
        const now = Date.now();
        const state = get();
        const diff = now - state.lastDailyRewardClaimed;

        // At least 20 hours must pass
        if (diff < 20 * 3600 * 1000) return;

        let nextStreak = state.dailyRewardStreak + 1;
        if (diff > 48 * 3600 * 1000) {
          nextStreak = 1;
        }
        if (nextStreak > 7) {
          nextStreak = 1;
        }

        const rewards = [1000, 5000, 15000, 50000, 150000, 500000, 2000000];
        const prize = rewards[nextStreak - 1];

        set({
          capital: state.capital + prize,
          totalEarned: state.totalEarned + prize,
          dailyRewardStreak: nextStreak,
          lastDailyRewardClaimed: now,
        });
        get().checkAchievements();
      },

      mergeBusinesses: (mergeType: 'holding' | 'hitech' | 'oilgas') => {
        set((state) => {
          const getLvl = (id: string) => state.businesses.find(b => b.id === id);
          if (mergeType === 'holding') {
            const bank = getLvl('bank');
            const retail = getLvl('retail');
            const factory = getLvl('factory');
            const holding = getLvl('holding');

            if (!bank || !retail || !factory || !holding) return {};
            if (bank.level < 10 || bank.count === 0) return {};
            if (retail.level < 10 || retail.count === 0) return {};
            if (factory.level < 10 || factory.count === 0) return {};

            return {
              businesses: state.businesses.map(b => {
                if (b.id === 'bank' || b.id === 'retail' || b.id === 'factory') {
                  return { ...b, count: b.count - 1, employees: [] };
                }
                if (b.id === 'holding') {
                  return { ...b, count: b.count + 1 };
                }
                return b;
              }),
            };
          } else if (mergeType === 'hitech') {
            const it = getLvl('it_company');
            const factory = getLvl('factory');
            const space = getLvl('space_agency');

            if (!it || !factory || !space) return {};
            if (it.level < 10 || it.count === 0) return {};
            if (factory.level < 10 || factory.count === 0) return {};

            return {
              businesses: state.businesses.map(b => {
                if (b.id === 'it_company' || b.id === 'factory') {
                  return { ...b, count: b.count - 1, employees: [] };
                }
                if (b.id === 'space_agency') {
                  return { ...b, count: b.count + 1 };
                }
                return b;
              }),
            };
          } else if (mergeType === 'oilgas') {
            const logistics = getLvl('logistics');
            const factory = getLvl('factory');
            const oil = getLvl('oil_gas');

            if (!logistics || !factory || !oil) return {};
            if (logistics.level < 10 || logistics.count === 0) return {};
            if (factory.level < 10 || factory.count === 0) return {};
            if (state.capital < 2000000000) return {};

            return {
              capital: state.capital - 2000000000,
              businesses: state.businesses.map(b => {
                if (b.id === 'logistics' || b.id === 'factory') {
                  return { ...b, count: b.count - 1, employees: [] };
                }
                if (b.id === 'oil_gas') {
                  return { ...b, count: b.count + 1 };
                }
                return b;
              }),
            };
          }
          return {};
        });
        get().checkAchievements();
      },

      tickGame: (seconds: number) => {
        set((state) => {
          const rdUpgrades = state.rdUpgrades || {};
          // 1. Calculate base businesses incomes
          let businessIncome = state.businesses.reduce((sum, b) => {
            return sum + getBoostedBusinessIncome(sum === 0 ? b : b, rdUpgrades);
          }, 0);

          const realEstateIncome = state.realEstate.reduce((sum, r) => sum + r.count * r.rent, 0);

          // 2. Active Taxi Fleet income
          const taxiFleetBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
          const taxiFleetIncome = ((state.taxiFleet.economy * 2) + (state.taxiFleet.comfort * 8) + (state.taxiFleet.business * 25)) * taxiFleetBoost;

          // 3. Airline Routes purchased income
          const routesBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
          const routesIncome = state.airlineRoutes.filter(r => r.purchased).reduce((s, r) => s + r.income, 0) * routesBoost;

          // 4. Tick Active Bank Loans and collect payments
          let bankLoansIncome = 0;
          const nextLoans = state.activeLoans.map(l => {
            const nextDuration = Math.max(0, l.duration - seconds);
            // Default check: 0.15% per second per 10% risk
            const hasDefaulted = Math.random() < (l.risk / 100) * 0.015 * seconds;
            if (hasDefaulted) {
              return null; // loan defaulted (dead)
            }
            if (nextDuration > 0) {
              bankLoansIncome += l.paymentPerSecond * seconds;
              return { ...l, duration: nextDuration };
            }
            // Completed
            bankLoansIncome += l.paymentPerSecond * l.duration;
            return null;
          }).filter(Boolean) as BankLoan[];

          // 5. Cinema Screenings ticking
          let cinemaMoviePayout = 0;
          let nextMovieProgress = state.cinemaMovieProgress;
          let nextMovieActive = state.cinemaMovieActive;
          let nextMovieDuration = state.cinemaMovieDuration;
          if (state.cinemaMovieActive) {
            nextMovieProgress += seconds;
            if (nextMovieProgress >= state.cinemaMovieDuration) {
              // Movie finished! Award payout based on cinema count and level
              const cinema = state.businesses.find(b => b.id === 'cinema');
              const count = cinema ? cinema.count : 0;
              const level = cinema ? cinema.level : 1;
              cinemaMoviePayout = 12000 * count * level;
              nextMovieActive = null;
              nextMovieProgress = 0;
              nextMovieDuration = 0;
            }
          }

          // 6. Football match updates
          let footballMatchPayout = 0;
          let nextMatchActive = state.fcMatchActive;
          let nextMatchTimer = state.fcMatchTimer;
          let nextMatchLog = state.fcMatchLog;
          let nextPrestige = state.prestige;

          if (state.fcMatchActive) {
            nextMatchTimer += seconds;
            if (nextMatchTimer >= 5) {
              nextMatchActive = false;
              nextMatchTimer = 0;
              const squadRating = state.fcPlayers.length > 0
                ? (state.fcPlayers.reduce((s, p) => s + p.rating, 0) / state.fcPlayers.length) + state.fcTrainingLevel * 2.5
                : state.fcTrainingLevel * 2.5;

              const winChance = squadRating / (squadRating + state.fcOpponentRating);
              const win = Math.random() < winChance;

              if (win) {
                const prize = Math.round(state.fcOpponentRating * 160000);
                footballMatchPayout = prize;
                nextPrestige += 250;
                nextMatchLog = `Match finished! MAGNIFICENT VICTORY! Rating: ${squadRating.toFixed(0)} vs Opponent: ${state.fcOpponentRating}. Secured cup trophy and +$${prize.toLocaleString()}!`;
              } else {
                nextMatchLog = `Match finished. Defeat... Final whistle reflects the opponent's superior tactics. Squad rating: ${squadRating.toFixed(0)} vs Opponent: ${state.fcOpponentRating}. Squad training/upgrades advised.`;
              }
            }
          }

          // 7. Clothing Brand collection releases updates
          let clothingCollectionPayout = 0;
          let nextCollectionActive = state.clothingCollectionActive;
          let nextCollectionProgress = state.clothingCollectionProgress;

          if (state.clothingCollectionActive) {
            nextCollectionProgress += seconds;
            if (nextCollectionProgress >= state.clothingCollectionDuration) {
              nextCollectionActive = false;
              nextCollectionProgress = 0;
              
              const brand = state.businesses.find(b => b.id === 'clothing_brand');
              const count = brand ? brand.count : 0;
              const level = brand ? brand.level : 1;
              clothingCollectionPayout = Math.round(380000 * (state.clothingCollectionQuality / 20) * count * level);
              nextPrestige += 120;
            }
          }

          // 8. Space Agency missions updates
          let spaceMissionPayout = 0;
          let nextSpaceActive = state.spaceMissionActive;
          let nextSpaceProgress = state.spaceMissionProgress;
          let nextSpaceLog = state.spaceMissionLog;

          if (state.spaceMissionActive && state.spaceMissionDestination) {
            nextSpaceProgress += seconds;
            if (nextSpaceProgress >= state.spaceMissionDuration) {
              nextSpaceActive = false;
              nextSpaceProgress = 0;
              
              const success = (Math.random() * 100) < state.spaceMissionSuccessRate;
              if (success) {
                const agency = state.businesses.find(b => b.id === 'space_agency');
                const count = agency ? agency.count : 0;
                const level = agency ? agency.level : 1;
                const destMult = state.spaceMissionDestination === 'mars' ? 12 : state.spaceMissionDestination === 'moon' ? 4 : 2;
                
                let payout = 15000000 * destMult * count * level;
                if (rdUpgrades['rd_fusion_propulsion']) {
                  payout *= 1.50;
                }
                spaceMissionPayout = payout;
                nextPrestige += state.spaceMissionDestination === 'mars' ? 2500 : state.spaceMissionDestination === 'moon' ? 800 : 200;
                nextSpaceLog = `Mission SUCCESSFUL! Outer atmosphere vector resolved. Telemetry link secured. Earned +$${spaceMissionPayout.toLocaleString()} and prestige points!`;
              } else {
                nextSpaceLog = `Mission FAILURE. Sub-orbital vehicle suffered engine core containment fail during thrust vectoring. Rocket destroyed. All payload lost.`;
              }
            }
          }

          // 9. Oil wells reserve generation
          const oilBiz = state.businesses.find(b => b.id === 'oil_gas');
          const oilCount = oilBiz ? oilBiz.count : 0;
          const oilRateBonus = rdUpgrades['rd_quantum_sensor'] ? 1.40 : 1.0;
          const nextOilReserve = state.oilReserve + Math.round(state.oilWellsCount * 0.45 * seconds * oilCount * oilRateBonus);

          const totalIPS = Math.max(-1000000, businessIncome + realEstateIncome + taxiFleetIncome + routesIncome);
          const passiveEarnings = totalIPS * seconds;
          const activeEarnings = bankLoansIncome + cinemaMoviePayout + footballMatchPayout + clothingCollectionPayout + spaceMissionPayout;
          const earnings = passiveEarnings + activeEarnings;

          const updatedBusinesses = state.businesses.map(b => {
            if (b.id === 'bank' && b.count > 0) {
              const depositRate = b.depositRate ?? 1.0;
              const loanRate = b.loanRate ?? 1.0;
              const currentFund = b.bankVaultFund ?? 0;
              const capacity = (b.bankVaultCapacity ?? 100000000) * b.level;

              let nextFund = currentFund;
              if (depositRate > loanRate) {
                const growth = b.count * 500000 * (depositRate - loanRate) * b.level * seconds;
                nextFund = Math.min(capacity, currentFund + growth);
              } else {
                const decay = b.count * 100000 * (loanRate - depositRate) * seconds;
                nextFund = Math.max(0, currentFund - decay);
              }

              return { ...b, bankVaultFund: nextFund, bankVaultCapacity: capacity };
            }
            return b;
          });

          const updatedFlippedCars = state.flippedCars.map(car => {
            if (car.status === 'repairing') {
              const nextProgress = car.repairProgress + seconds;
              return {
                ...car,
                repairProgress: nextProgress,
                status: nextProgress >= car.repairTime ? ('repaired' as const) : ('repairing' as const),
              };
            }
            return car;
          });

          let itPayout = 0;
          const updatedITProjects = state.itProjects.map(proj => {
            if (proj.status === 'running') {
              const nextProgress = proj.progress + seconds;
              if (nextProgress >= proj.duration) {
                itPayout += proj.payout;
                return { ...proj, progress: 0, status: 'completed' as const };
              }
              return { ...proj, progress: nextProgress };
            }
            return proj;
          });

          let skyPayout = 0;
          const updatedSkyscrapers = state.skyscraperProjects.map(sky => {
            if (sky.status === 'building') {
              const nextProgress = sky.progress + seconds;
              if (nextProgress >= sky.duration) {
                skyPayout += sky.payout;
                return { ...sky, progress: 0, status: 'completed' as const };
              }
              return { ...sky, progress: nextProgress };
            }
            return sky;
          });

          const stockValue = state.stocks.reduce((sum, s) => sum + s.sharesOwned * s.currentPrice, 0);
          const cryptoValue = state.crypto.reduce((sum, c) => sum + c.coinsOwned * c.currentPrice, 0);
          const realEstateValue = state.realEstate.reduce((sum, r) => sum + r.count * r.cost, 0);
          const businessValue = state.businesses.reduce((sum, b) => sum + b.count * b.income * 100, 0);
          const nftValue = state.nfts.reduce((sum, n) => sum + n.count * n.costETH * 3500, 0);

          const payoutBoost = itPayout + skyPayout;
          const newCapital = state.capital + earnings + payoutBoost;
          const netWorth = newCapital + stockValue + cryptoValue + realEstateValue + businessValue + nftValue;

          return {
            capital: newCapital,
            totalEarned: state.totalEarned + earnings + payoutBoost,
            netWorth,
            prestige: nextPrestige,
            businesses: updatedBusinesses,
            flippedCars: updatedFlippedCars,
            itProjects: updatedITProjects,
            skyscraperProjects: updatedSkyscrapers,
            activeLoans: nextLoans,
            cinemaMovieActive: nextMovieActive,
            cinemaMovieProgress: nextMovieProgress,
            cinemaMovieDuration: nextMovieDuration,
            fcMatchActive: nextMatchActive,
            fcMatchTimer: nextMatchTimer,
            fcMatchLog: nextMatchLog,
            clothingCollectionActive: nextCollectionActive,
            clothingCollectionProgress: nextCollectionProgress,
            spaceMissionActive: nextSpaceActive,
            spaceMissionProgress: nextSpaceProgress,
            spaceMissionLog: nextSpaceLog,
            oilReserve: nextOilReserve,
            lastActive: Date.now(),
          };
        });
      },

      tickStocks: () => {
        set((state) => {
          const updatedStocks = state.stocks.map((stock) => {
            const direction = Math.random() > 0.49 ? 1 : -1;
            const changePercent = (Math.random() * stock.volatility) / 4; // Dampened volatility
            const priceChange = stock.currentPrice * changePercent * direction;
            const nextPrice = Math.max(1, Math.round((stock.currentPrice + priceChange) * 100) / 100);
            const nextHistory = [...stock.history.slice(-11), nextPrice];
            return { ...stock, currentPrice: nextPrice, history: nextHistory };
          });

          const oilDirection = Math.random() > 0.49 ? 1 : -1;
          const oilPriceChange = state.oilPrice * (0.005 + Math.random() * 0.015) * oilDirection * 0.25; // Dampened oil swings
          const nextOilPrice = Math.max(30.0, Math.round((state.oilPrice + oilPriceChange) * 100) / 100);

          return { 
            stocks: updatedStocks,
            oilPrice: nextOilPrice,
          };
        });
      },

      tickCrypto: () => {
        set((state) => {
          const updatedCrypto = state.crypto.map((coin) => {
            const direction = Math.random() > 0.48 ? 1 : -1;
            const changePercent = (Math.random() * coin.volatility) / 3; // Dampened volatility
            const priceChange = coin.currentPrice * changePercent * direction;
            const nextPrice = Math.max(0.001, Math.round((coin.currentPrice + priceChange) * 1000) / 1000);
            const nextHistory = [...coin.history.slice(-11), nextPrice];
            return { ...coin, currentPrice: nextPrice, history: nextHistory };
          });
          return { crypto: updatedCrypto };
        });
      },

      checkAchievements: () => {
        const state = get();
        const updated = state.achievements.map(ach => {
          if (ach.unlocked) return ach;
          const definition = ACHIEVEMENT_DEFINITIONS.find(def => def.id === ach.id);
          if (!definition || !definition.condition) return ach;
          try {
            if (definition.condition(state)) {
              return { ...ach, unlocked: true, unlockedAt: Date.now() };
            }
          } catch {}
          return ach;
        });
        const anyUnlocked = updated.some((a, i) => a.unlocked && !state.achievements[i].unlocked);
        if (anyUnlocked) set({ achievements: updated });
      },

      clearOfflineEarnings: () => set({ offlineEarnings: 0 }),
    }),
    {
      name: 'business-empire-save-v3',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        capital: state.capital,
        totalEarned: state.totalEarned,
        prestige: state.prestige,
        netWorth: state.netWorth,
        lastActive: state.lastActive,
        offlineEarnings: state.offlineEarnings,
        businesses: state.businesses,
        stocks: state.stocks,
        crypto: state.crypto,
        realEstate: state.realEstate,
        luxury: state.luxury,
        nfts: state.nfts,
        achievements: state.achievements,
        flippedCars: state.flippedCars,
        itProjects: state.itProjects,
        skyscraperProjects: state.skyscraperProjects,
        dailyRewardStreak: state.dailyRewardStreak,
        lastDailyRewardClaimed: state.lastDailyRewardClaimed,
        language: state.language,
        themeOverride: state.themeOverride,
        clickPowerLevel: state.clickPowerLevel,
        carsFlippedCount: state.carsFlippedCount,
        totalClicks: state.totalClicks,
        rdUpgrades: state.rdUpgrades,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Merge & migrate lists from initialData to loaded save state to fix old schemas
          try {
            if (state.realEstate) {
              state.realEstate = INITIAL_REAL_ESTATE.map(newItem => {
                const existing = state.realEstate.find(r => r.id === newItem.id);
                return {
                  ...newItem,
                  count: existing ? existing.count : 0,
                  upgradeLevel: existing ? existing.upgradeLevel : 1,
                  upgradeCost: existing && existing.upgradeCost ? existing.upgradeCost : newItem.upgradeCost,
                };
              });
            } else {
              state.realEstate = INITIAL_REAL_ESTATE;
            }

            if (state.luxury) {
              state.luxury = INITIAL_LUXURY.map(newItem => {
                const existing = state.luxury.find(l => l.id === newItem.id);
                return {
                  ...newItem,
                  count: existing ? existing.count : 0,
                };
              });
            } else {
              state.luxury = INITIAL_LUXURY;
            }

            if (state.businesses) {
              state.businesses = INITIAL_BUSINESSES.map(newItem => {
                const existing = state.businesses.find(b => b.id === newItem.id);
                return {
                  ...newItem,
                  count: existing ? existing.count : 0,
                  level: existing ? existing.level : 1,
                  employees: existing ? existing.employees : [],
                  managerHired: existing ? existing.managerHired : false,
                  bankVaultFund: existing && existing.bankVaultFund !== undefined ? existing.bankVaultFund : (newItem.bankVaultFund ?? 0),
                  depositRate: existing && existing.depositRate !== undefined ? existing.depositRate : (newItem.depositRate ?? 1.0),
                  loanRate: existing && existing.loanRate !== undefined ? existing.loanRate : (newItem.loanRate ?? 1.0),
                  customName: existing ? existing.customName : undefined,
                };
              });
            } else {
              state.businesses = INITIAL_BUSINESSES;
            }
          } catch (e) {
            console.warn('Rehydration migration failed', e);
          }

          const now = Date.now();
          const elapsedSeconds = Math.max(0, Math.floor((now - state.lastActive) / 1000));

          if (elapsedSeconds > 10) {
            const rdUpgrades = state.rdUpgrades || {};
            const businessIncome = state.businesses.reduce((sum, b) => {
              return sum + getBoostedBusinessIncome(sum === 0 ? b : b, rdUpgrades);
            }, 0);

            const realEstateIncome = state.realEstate.reduce((sum, r) => sum + r.count * r.rent, 0);
            const taxiFleetBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
            const taxiFleetIncome = (((state.taxiFleet?.economy || 0) * 2) + ((state.taxiFleet?.comfort || 0) * 8) + ((state.taxiFleet?.business || 0) * 25)) * taxiFleetBoost;
            const routesBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
            const routesIncome = (state.airlineRoutes?.filter(r => r.purchased).reduce((s, r) => s + r.income, 0) || 0) * routesBoost;

            const totalIPS = Math.max(0, businessIncome + realEstateIncome + taxiFleetIncome + routesIncome);
            const cappedSeconds = Math.min(elapsedSeconds, 8 * 60 * 60); // 8 Hours Cap
            const offlineEarnings = Math.round(totalIPS * cappedSeconds * 0.40); // 40% Efficiency

            if (offlineEarnings > 0) {
              state.capital += offlineEarnings;
              state.totalEarned += offlineEarnings;
              state.offlineEarnings = offlineEarnings;
            }
          }
          state.lastActive = now;
        }
      },
    }
  )
);

// ─────────────────────────────────────────────
//  SELECTORS
// ─────────────────────────────────────────────

export const selectIPS = (state: GameState) => {
  const rdUpgrades = state.rdUpgrades || {};
  const businessIncome = state.businesses.reduce((sum, b) => {
    return sum + getBoostedBusinessIncome(sum === 0 ? b : b, rdUpgrades);
  }, 0);
  
  const realEstateIncome = state.realEstate.reduce((sum, r) => sum + r.count * r.rent, 0);
  const taxiFleetBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
  const taxiFleetIncome = (((state.taxiFleet?.economy || 0) * 2) + ((state.taxiFleet?.comfort || 0) * 8) + ((state.taxiFleet?.business || 0) * 25)) * taxiFleetBoost;
  const routesBoost = rdUpgrades['rd_clean_energy'] ? 1.25 : 1.0;
  const routesIncome = (state.airlineRoutes?.filter(r => r.purchased).reduce((s, r) => s + r.income, 0) || 0) * routesBoost;
  
  return Math.max(0, businessIncome + realEstateIncome + taxiFleetIncome + routesIncome);
};

export const selectTotalEmployees = (state: GameState) =>
  state.businesses.reduce((sum, b) => sum + b.employees.length, 0);
