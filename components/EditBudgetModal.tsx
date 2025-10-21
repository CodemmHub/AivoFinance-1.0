import React, { useState, useEffect } from 'react';
import { Budget } from '../types';
import { XIcon } from './icons/XIcon';

interface EditBudgetModalProps {
  onClose: () => void;
  onUpdateBudget: (budget: Budget) => void;
  budget: Budget;
  expenseCategories: string[];
  existingBudgets: Budget[];
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ onClose, onUpdateBudget, budget, expenseCategories, existingBudgets }) => {
  const [amount, setAmount] = useState(String(budget.amount));

  useEffect(() => {
    setAmount(String(budget.amount));
  }, [budget]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    onUpdateBudget({ ...budget, amount: parseFloat(amount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Budget</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <input
              id="category"
              type="text"
              value={budget.category}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Amount (AED)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
              min="0.01"
              step="0.01"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Budget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBudgetModal;