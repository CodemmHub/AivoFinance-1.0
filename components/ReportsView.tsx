import React, { useMemo } from 'react';
import { Transaction, Wallet, Debt, Asset, FixedDeposit, TransactionType } from '../types';
import { getSpendingByCategory, getMonthlySummary, getNetWorthHistory } from '../utils/calculations';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, XAxis, YAxis, Legend, Bar, LineChart, Line } from 'recharts';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface ReportsViewProps {
  transactions: Transaction[];
  wallets: Wallet[];
  debts: Debt[];
  assets: Asset[];
  fixedDeposits: FixedDeposit[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF4274', '#8884d8'];

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-700 p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
        <p className="label font-semibold">{`${label} : ${formatter(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};

const ReportsView: React.FC<ReportsViewProps> = ({ transactions, wallets, debts, assets, fixedDeposits }) => {
    const { baseCurrency } = useGoogleDriveData();
    const formatCurrency = useCurrencyFormatter();
    
    const spendingData = useMemo(() => getSpendingByCategory(transactions), [transactions]);
    const monthlySummary = useMemo(() => getMonthlySummary(transactions), [transactions]);
    const netWorthHistory = useMemo(() => getNetWorthHistory(transactions, wallets, debts, assets, fixedDeposits, baseCurrency), [transactions, wallets, debts, assets, fixedDeposits, baseCurrency]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Financial Reports</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
                     {spendingData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={spendingData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                    {spendingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                     ) : <p className="text-center text-gray-500 py-12">No expense data to display.</p>}
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Net Worth Over Time</h2>
                    {netWorthHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={netWorthHistory} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis dataKey="month" />
                                <YAxis width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Line type="monotone" dataKey="netWorth" stroke="#8884d8" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-gray-500 py-12">Not enough data to calculate net worth history.</p>}
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Monthly Income vs. Expense</h2>
                 {monthlySummary.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={monthlySummary} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <XAxis dataKey="month" />
                             <YAxis width={80} tickFormatter={(value) => new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value)} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="income" fill="#00C49F" />
                            <Bar dataKey="expense" fill="#FF8042" />
                        </BarChart>
                    </ResponsiveContainer>
                 ) : <p className="text-center text-gray-500 py-12">No transaction data for this period.</p>}
            </div>
        </div>
    );
};

export default ReportsView;
