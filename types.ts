export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'LKR', 'AED'];

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number; // in Base Currency
  type: TransactionType;
  category: string;
  walletId: string;
  originalAmount?: number; // In wallet's currency
  currency?: string; // The wallet's currency
  exchangeRate?: number; // From wallet's currency to Base Currency
  remarks?: string;
}

export interface Wallet {
  id: string;
  name: string;
  initialBalance: number; // In wallet's currency
  currency: string;
}

export interface Categories {
  INCOME: string[];
  EXPENSE: string[];
}

export type CategoryEditTarget = {
  name: string;
  type: TransactionType;
};

export enum DebtType {
    CURRENT = 'CURRENT', // Money is received now
    OLD = 'OLD',         // Money was received and spent in the past
}

export interface Debt {
    id: string;
    type: DebtType;
    description: string;
    lender: string;
    amount: number; // in Base Currency
    dateIncurred: string; // ISO string
    originalAmount?: number;
    currency?: string;
    exchangeRate?: number;
    remarks?: string;
}

export enum BillingCycle {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY',
}

export enum SubscriptionType {
    NEW = 'NEW',         // A new subscription with immediate payment
    EXISTING = 'EXISTING', // An existing subscription to track future payments
}

export interface Subscription {
    id: string;
    name: string;
    type: SubscriptionType;
    amount: number; // in Base Currency
    billingCycle: BillingCycle;
    nextDueDate: string; // ISO string
    walletId: string;
    category: string;
    remarks?: string;
}

export enum AssetType {
    REAL_ESTATE = 'Real Estate',
    STOCKS = 'Stocks',
    CRYPTO = 'Crypto',
    OTHER = 'Other',
}

export enum AssetPurchaseType {
    CURRENT = 'CURRENT', // Purchased now
    OLD = 'OLD',         // Purchased in the past
}

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    purchaseType: AssetPurchaseType;
    currentValue: number; // in Base Currency
    purchaseDate: string; // ISO string
    remarks?: string;
}

export enum FixedDepositPurchaseType {
    CURRENT = 'CURRENT', // Purchased now
    OLD = 'OLD',         // Purchased in the past
}

export interface FixedDeposit {
    id: string;
    purchaseType: FixedDepositPurchaseType;
    bankName: string;
    principalAmount: number; // in Base Currency
    interestRate: number; // percentage
    startDate: string; // ISO string
    maturityDate: string; // ISO string
    maturityAmount?: number; // calculated
    remarks?: string;
}

export enum CheckStatus {
    PENDING = 'PENDING',
    CLEARED = 'CLEARED',
    BOUNCED = 'BOUNCED',
    CANCELED = 'CANCELED',
}

export interface Check {
    id: string;
    payee: string;
    amount: number; // In Base Currency
    walletId: string;
    category: string;
    checkNumber: string;
    issueDate: string; // ISO string
    dueDate: string; // ISO string
    status: CheckStatus;
    remarks?: string;
    originalAmount?: number;
    currency?: string;
    exchangeRate?: number;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  targetDate?: string;
}

export interface UserSettings {
  baseCurrency: string;
}

// Represents the structure of the single data file stored in Google Drive
export interface AppData {
  userSettings?: UserSettings;
  transactions: Transaction[];
  wallets: Wallet[];
  categories: Categories;
  debts: Debt[];
  subscriptions: Subscription[];
  assets: Asset[];
  fixedDeposits: FixedDeposit[];
  checks: Check[];
  budgets: Budget[];
  goals: Goal[];
}