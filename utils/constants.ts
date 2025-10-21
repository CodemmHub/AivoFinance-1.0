import { AppData } from '../types';
import { APP_VERSION } from '../services/versionService';

export const DEFAULT_CURRENCIES = ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'AED'];

export const INITIAL_DATA: Omit<AppData, 'settings'> = {
    version: APP_VERSION,
    currencies: [...DEFAULT_CURRENCIES],
    wallets: [],
    categories: {
        INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
        EXPENSE: [
            'Food & Drink',
            'Shopping',
            'Housing',
            'Transportation',
            'Bills & Utilities',
            'Entertainment',
            'Health & Wellness',
            'Travel',
            'Education',
            'Family & Friends',
            'Subscriptions',
            'Transfer',
            'Check Payment',
            'Investment',
            'Debt',
            'Other'
        ],
    },
    transactions: [],
    debts: [],
    subscriptions: [],
    assets: [],
    fixedDeposits: [],
    checks: [],
    budgets: [],
    goals: [],
};