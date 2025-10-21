import React from 'react';
import { Transaction, Wallet, Debt, Asset, FixedDeposit, Check, CheckStatus, TransactionType } from '../types';
import { calculateNetWorth, calculateTotalBalance, calculateTotalExpenses, calculateTotalIncome } from '../utils/calculations';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface DashboardProps {
  transactions: Transaction[];
  wallets: Wallet[];
  debts: Debt[];
  assets: Asset[];
  fixedDeposits: FixedDeposit[];
  checks: Check[];
}

const StatCard: React.FC<{ title: string; value: string; colorClass?: string }> = ({ title, value, colorClass = 'text-gray-800 dark:text-white' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className={`text-3xl font-bold mt-1 ${colorClass}`}>{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ transactions, wallets, debts, assets, fixedDeposits, checks }) => {
    const { baseCurrency } = useGoogleDriveData();
    const formatCurrency = useCurrencyFormatter();
    
    const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(dateString));

    const netWorth = calculateNetWorth(wallets, transactions, debts, assets, fixedDeposits, baseCurrency);
    const totalCash = calculateTotalBalance(wallets, transactions, baseCurrency);
    const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);
    const totalAssets = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    const totalFDs = fixedDeposits.reduce((sum, fd) => sum + fd.principalAmount, 0);

    const recentTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
    
    const upcomingChecks = checks
        .filter(c => c.status === CheckStatus.PENDING && new Date(c.dueDate) >= new Date())
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const monthlyIncome = calculateTotalIncome(transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()));
    const monthlyExpenses = calculateTotalExpenses(transactions.filter(t => new Date(t.date).getMonth() === new Date().getMonth()));

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Net Worth" value={formatCurrency(netWorth)} colorClass="text-blue-600 dark:text-blue-400" />
                <StatCard title="Total Cash" value={formatCurrency(totalCash)} />
                <StatCard title="Total Assets" value={formatCurrency(totalAssets + totalFDs)} />
                <StatCard title="Total Debts" value={formatCurrency(totalDebts)} colorClass="text-red-500 dark:text-red-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">This Month's Flow</h2>
                     <div className="flex justify-around items-center h-full">
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Income</p>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(monthlyIncome)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Expenses</p>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(monthlyExpenses)}</p>
                        </div>
                     </div>
                 </div>

                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
                     <div className="space-y-3">
                         {recentTransactions.length > 0 ? recentTransactions.map(t => (
                             <div key={t.id} className="flex justify-between items-center text-sm">
                                 <div>
                                    <p className="font-medium text-gray-800 dark:text-gray-100">{t.description}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{t.category}</p>
                                 </div>
                                 <p className={`font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500' : 'text-red-500'}`}>
                                    {t.type === TransactionType.INCOME ? '+' : '-'} {formatCurrency(t.amount)}
                                 </p>
                             </div>
                         )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No recent transactions.</p>}
                     </div>
                 </div>

                 <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                     <h2 className="text-xl font-semibold mb-4">Upcoming Checks</h2>
                     <div className="space-y-3">
                         {upcomingChecks.length > 0 ? upcomingChecks.map(c => (
                             <div key={c.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-3">
                                    <ReceiptPercentIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-gray-100">{c.payee}</p>
                                        <p className="text-gray-500 dark:text-gray-400">Due: {formatDate(c.dueDate)}</p>
                                    </div>
                                </div>
                                <p className="font-semibold text-yellow-600 dark:text-yellow-400">{formatCurrency(c.amount)}</p>
                             </div>
                         )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No upcoming checks.</p>}
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default Dashboard;
