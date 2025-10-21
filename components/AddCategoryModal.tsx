import React, { useState } from 'react';
import { TransactionType } from '../types';
import { XIcon } from './icons/XIcon';

interface AddCategoryModalProps {
  onClose: () => void;
  onAddCategory: (name: string, type: TransactionType) => void;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ onClose, onAddCategory }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a category name.');
      return;
    }
    onAddCategory(name, type);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              id="categoryName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Subscriptions"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="categoryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category Type</label>
            <select
              id="categoryType"
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            >
              <option value={TransactionType.EXPENSE}>Expense</option>
              <option value={TransactionType.INCOME}>Income</option>
            </select>
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryModal;