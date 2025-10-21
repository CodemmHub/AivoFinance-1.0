import React, { useState } from 'react';
import { Goal } from '../types';
import { XIcon } from './icons/XIcon';

interface UpdateGoalModalProps {
  onClose: () => void;
  onUpdateProgress: (goalId: string, amount: number) => void;
  goal: Goal;
}

const UpdateGoalModal: React.FC<UpdateGoalModalProps> = ({ onClose, onUpdateProgress, goal }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'add' | 'withdraw'>('add');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!amount || isNaN(value) || value <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    
    const amountToUpdate = type === 'add' ? value : -value;

    if (type === 'withdraw' && value > goal.savedAmount) {
        alert("Cannot withdraw more than the saved amount.");
        return;
    }

    onUpdateProgress(goal.id, amountToUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Update Progress</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">for <span className="font-semibold">{goal.name}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <div className="flex justify-center gap-4 mb-4">
                    <button type="button" onClick={() => setType('add')} className={`px-4 py-2 rounded-lg font-semibold ${type === 'add' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Add Funds</button>
                    <button type="button" onClick={() => setType('withdraw')} className={`px-4 py-2 rounded-lg font-semibold ${type === 'withdraw' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>Withdraw</button>
                </div>
            </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (AED)</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              required
              min="0.01"
              step="0.01"
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currently saved: {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(goal.savedAmount)}</p>
          </div>
         
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateGoalModal;