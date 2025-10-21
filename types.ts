export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  description: string;
  amount: number; // in base currency
  type: TransactionType;
  category: string;
  walletId: string;
  remarks?: string;
  // For foreign currency transactions
  originalAmount?: number;
  currency?: string;
  exchangeRate?: number;
}

export interface Wallet {
  id: string;
  name: string;
  initialBalance: number;
  currency: string;
}

export interface Categories {
  INCOME: string[];
  EXPENSE: string[];
}

export enum DebtType {
  CURRENT = 'CURRENT', // A new debt that creates a transaction
  OLD = 'OLD' // An existing debt to track
}

export interface Debt {
    id: string;
    description: string;
    lender: string;
    amount: number; // in base currency
    dateIncurred: string; // ISO 8601 format
    remarks?: string;
    type: DebtType;
    // For foreign currency debts
    originalAmount?: number;
    currency?: string;
}

export enum AssetType {
    REAL_ESTATE = 'Real Estate',
    STOCKS = 'Stocks',
    CRYPTO = 'Cryptocurrency',
    OTHER = 'Other'
}

export enum AssetPurchaseType {
    CURRENT = 'CURRENT',
    OLD = 'OLD'
}

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    purchaseType: AssetPurchaseType;
    currentValue: number; // in base currency
    purchaseDate: string; // ISO 8601 format
    remarks?: string;
}

export enum FixedDepositPurchaseType {
    CURRENT = 'CURRENT',
    OLD = 'OLD'
}

export interface FixedDeposit {
    id: string;
    purchaseType: FixedDepositPurchaseType;
    bankName: string;
    principalAmount: number; // in base currency
    interestRate: number; // percentage
    startDate: string; // ISO 8601 format
    maturityDate: string; // ISO 8601 format
    maturityAmount?: number; // optional, can be calculated
    remarks?: string;
}

export enum CheckStatus {
    PENDING = 'Pending',
    CLEARED = 'Cleared',
    BOUNCED = 'Bounced',
    CANCELED = 'Canceled'
}

export interface Check {
    id: string;
    payee: string;
    amount: number; // in base currency
    walletId: string;
    category: string;
    checkNumber: string;
    issueDate: string; // ISO 8601 format
    dueDate: string; // ISO 8601 format
    status: CheckStatus;
    remarks?: string;
    // For foreign currency checks
    originalAmount?: number;
    currency?: string;
    exchangeRate?: number;
}

export enum BillingCycle {
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}

export enum SubscriptionType {
    NEW = 'NEW',
    EXISTING = 'EXISTING'
}

export interface Subscription {
    id: string;
    name: string;
    type: SubscriptionType;
    amount: number; // in base currency
    billingCycle: BillingCycle;
    nextDueDate: string; // ISO 8601 format
    walletId: string;
    category: string;
    remarks?: string;
}

export interface Budget {
    id: string;
    category: string;
    amount: number; // in base currency
}

export interface Goal {
    id: string;
    name:string;
    targetAmount: number;
    savedAmount: number;
}

export interface CategoryEditTarget {
    name: string;
    type: TransactionType;
}

// Represents the entire structure of the data saved to Google Drive
export interface AppData {
    version: string;
    settings: {
        baseCurrency: string;
    };
    currencies: string[];
    wallets: Wallet[];
    categories: Categories;
    transactions: Transaction[];
    debts: Debt[];
    subscriptions: Subscription[];
    assets: Asset[];
    fixedDeposits: FixedDeposit[];
    checks: Check[];
    budgets: Budget[];
    goals: Goal[];
}