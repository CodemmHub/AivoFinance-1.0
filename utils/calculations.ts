import { Transaction, TransactionType, Wallet, Debt, Subscription, Asset, FixedDeposit, Budget } from '../types';

export const calculateWalletBalance = (wallet: Wallet, transactions: Transaction[]): number => {
  return transactions
    .filter(t => t.walletId === wallet.id)
    .reduce((balance, t) => {
      // Use the amount in the wallet's currency for calculation
      const transactionAmount = t.originalAmount ?? t.amount;
      if (t.type === TransactionType.INCOME) {
        return balance + transactionAmount;
      }
      return balance - transactionAmount;
    }, wallet.initialBalance);
};

export const calculateTotalBalance = (wallets: Wallet[], transactions: Transaction[], baseCurrency: string): number => {
    // This function sums up the base currency equivalent of all balances.
    const incomeInBase = transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
    const expenseInBase = transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
    
    // NOTE: This approximation does not account for exchange rate fluctuations on the initial balance over time.
    // It assumes the initial balance of a foreign currency wallet would need a stored exchange rate at the time of creation for full accuracy.
    const initialBalancesInBase = wallets.reduce((sum, w) => {
        if (w.currency === baseCurrency) {
            return sum + w.initialBalance;
        }
        // Foreign currency initial balances are not included in this simplified total cash calculation
        // to avoid inaccuracy without historical exchange rates.
        return sum;
    }, 0);

    return initialBalancesInBase + incomeInBase - expenseInBase;
};

export const calculateTotalIncome = (transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((total, t) => total + t.amount, 0); // amount is in base currency
};

export const calculateTotalExpenses = (transactions: Transaction[]): number => {
    return transactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((total, t) => total + t.amount, 0); // amount is in base currency
};


export const calculateNetWorth = (
    wallets: Wallet[],
    transactions: Transaction[],
    debts: Debt[],
    assets: Asset[],
    fixedDeposits: FixedDeposit[],
    baseCurrency: string
): number => {
    const totalCash = calculateTotalBalance(wallets, transactions, baseCurrency);
    const totalAssets = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalFDs = fixedDeposits.reduce((sum, fd) => sum + fd.principalAmount, 0);
    const totalLiabilities = debts.reduce((sum, debt) => sum + debt.amount, 0);

    return totalCash + totalAssets + totalFDs - totalLiabilities;
};

export const calculateMaturityAmount = (principal: number, rate: number, startDate: string, maturityDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(maturityDate);
    const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    // Simple interest for now: A = P(1 + rt)
    const maturityAmount = principal * (1 + (rate / 100) * years);
    return parseFloat(maturityAmount.toFixed(2));
}

export const calculateBudgetUsage = (budget: Budget, transactions: Transaction[]): { spent: number; remaining: number; percentage: number } => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const spent = transactions
        .filter(t => 
            t.type === TransactionType.EXPENSE &&
            t.category === budget.category &&
            new Date(t.date) >= firstDayOfMonth &&
            new Date(t.date) <= lastDayOfMonth
        )
        .reduce((sum, t) => sum + t.amount, 0);
    
    const remaining = budget.amount - spent;
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    
    return { spent, remaining, percentage: Math.min(percentage, 100) };
};

export const getSpendingByCategory = (transactions: Transaction[]): { name: string; value: number }[] => {
    const spending = new Map<string, number>();
    transactions.forEach(t => {
        if (t.type === TransactionType.EXPENSE) {
            spending.set(t.category, (spending.get(t.category) || 0) + t.amount);
        }
    });
    return Array.from(spending.entries()).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
};

export const getMonthlySummary = (transactions: Transaction[], months = 6): { month: string; income: number; expense: number }[] => {
    const summaries: { [key: string]: { income: number; expense: number } } = {};
    const today = new Date();

    for (let i = 0; i < months; i++) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        summaries[monthKey] = { income: 0, expense: 0 };
    }

    transactions.forEach(t => {
        const transactionDate = new Date(t.date);
        const monthKey = transactionDate.toLocaleString('default', { month: 'short', year: '2-digit' });

        if (summaries[monthKey]) {
            if (t.type === TransactionType.INCOME) {
                summaries[monthKey].income += t.amount;
            } else {
                summaries[monthKey].expense += t.amount;
            }
        }
    });
    
    return Object.entries(summaries).map(([month, values]) => ({ month, ...values })).reverse();
};

export const getNetWorthHistory = (
    transactions: Transaction[],
    wallets: Wallet[],
    debts: Debt[],
    assets: Asset[],
    fixedDeposits: FixedDeposit[],
    baseCurrency: string,
    months = 12
): { month: string; netWorth: number }[] => {
    const history: { month: string; netWorth: number }[] = [];
    const today = new Date();

    const initialCash = wallets.reduce((sum, w) => {
        // This is an approximation that doesn't account for foreign exchange on initial balance
        if (w.currency === baseCurrency) {
            return sum + w.initialBalance;
        }
        return sum;
    }, 0);
    
    // For simplicity, we assume asset/debt values are constant over the historical period shown
    const totalDebts = debts.reduce((sum, d) => sum + d.amount, 0);
    const totalAssets = assets.reduce((sum, a) => sum + a.currentValue, 0);
    const totalFDs = fixedDeposits.reduce((sum, fd) => sum + fd.principalAmount, 0);

    for (let i = months - 1; i >= 0; i--) {
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
        const monthKey = new Date(today.getFullYear(), today.getMonth() - i, 1).toLocaleString('default', { month: 'short', year: '2-digit' });

        const cashFlowUpToMonth = transactions
            .filter(t => new Date(t.date) <= endOfMonth)
            .reduce((sum, t) => sum + (t.type === TransactionType.INCOME ? t.amount : -t.amount), 0);

        const netWorth = initialCash + cashFlowUpToMonth + totalAssets + totalFDs - totalDebts;
        history.push({ month: monthKey, netWorth });
    }

    return history;
};
