import React, { useMemo } from 'react';
import { Debt } from '../types';
import { DebtItem } from './DebtItem';
import { PlusIcon } from './icons/PlusIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface DebtsViewProps {
  debts: Debt[];
  onAddDebt: () => void;
  onEditDebt: (debt: Debt) => void;
  onDeleteDebt: (id: string) => void;
}

const DebtsView: React.FC<DebtsViewProps> = ({ debts, onAddDebt, onEditDebt, onDeleteDebt }) => {
  const formatCurrency = useCurrencyFormatter();
  
  const debtsByLender = useMemo(() => {
    const grouped: { [key: string]: { debts: Debt[], total: number } } = {};
    debts.forEach(debt => {
      if (!grouped[debt.lender]) {
        grouped[debt.lender] = { debts: [], total: 0 };
      }
      grouped[debt.lender].debts.push(debt);
      grouped[debt.lender].total += debt.amount;
    });
    return Object.entries(grouped).sort(([, a], [, b]) => b.total - a.total);
  }, [debts]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Debts</h1>
        <button
          onClick={onAddDebt}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Debt
        </button>
      </div>

      <div className="space-y-8">
        {debts.length > 0 ? (
          debtsByLender.map(([lender, data]) => (
            <div key={lender} className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">{lender}</h2>
                <span className="font-bold text-lg text-red-500">{formatCurrency(data.total)}</span>
              </div>
              <div className="space-y-2">
                {data.debts.map(debt => (
                  <DebtItem key={debt.id} debt={debt} onEdit={onEditDebt} onDelete={onDeleteDebt} />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md">
            <CreditCardIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No debts recorded.</p>
            <p className="text-gray-500 dark:text-gray-400">Click "Add Debt" to track money you owe.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebtsView;
