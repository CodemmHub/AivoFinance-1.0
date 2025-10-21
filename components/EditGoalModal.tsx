import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { XIcon } from './icons/XIcon';

interface EditGoalModalProps {
  onClose: () => void;
  onUpdateGoal: (goal: Goal) => void;
  goal: Goal;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ onClose, onUpdateGoal, goal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    setName(goal.name);
    setTargetAmount(String(goal.targetAmount));
  }, [goal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !targetAmount || parseFloat(targetAmount) <= 0) {
      alert('Please enter a valid name and target amount.');
      return;
    }
    if (parseFloat(targetAmount) < goal.savedAmount) {
        alert("Target amount cannot be less than the amount already saved.");
        return;
    }
    onUpdateGoal({ ...goal, name, targetAmount: parseFloat(targetAmount) });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Goal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goalName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Goal Name</label>
            <input
              id="goalName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="targetAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Amount (AED)</label>
            <input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
              min="0.01"
              step="0.01"
            />
          </div>
           <p className="text-sm text-gray-500 dark:text-gray-400">Currently saved: {new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(goal.savedAmount)}</p>
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
              Update Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGoalModal;