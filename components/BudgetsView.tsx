import React from 'react';
import { Budget, Transaction } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { ScaleIcon } from './icons/ScaleIcon';
import { BudgetItem } from './BudgetItem';

interface BudgetsViewProps {
  budgets: Budget[];
  transactions: Transaction[];
  categories: string[];
  onAddBudget: () => void;
  onEditBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
}

const BudgetsView: React.FC<BudgetsViewProps> = ({ budgets, transactions, categories, onAddBudget, onEditBudget, onDeleteBudget }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Monthly Budgets</h1>
        <button
          onClick={onAddBudget}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Budget
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-4">
          {budgets.length > 0 ? (
            budgets.map(budget => (
              <BudgetItem
                key={budget.id}
                budget={budget}
                transactions={transactions}
                onEdit={onEditBudget}
                onDelete={onDeleteBudget}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <ScaleIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No budgets set.</p>
              <p className="text-gray-500 dark:text-gray-400">Click "Add Budget" to start tracking your spending.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetsView;