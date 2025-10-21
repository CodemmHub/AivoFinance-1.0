import React, { useState, useEffect } from 'react';
import { Wallet } from '../types';
import { XIcon } from './icons/XIcon';

interface EditWalletModalProps {
  onClose: () => void;
  onUpdateWallet: (wallet: Wallet) => void;
  wallet: Wallet;
}

const EditWalletModal: React.FC<EditWalletModalProps> = ({ onClose, onUpdateWallet, wallet }) => {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setInitialBalance(String(wallet.initialBalance));
    }
  }, [wallet]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !initialBalance || isNaN(parseFloat(initialBalance))) {
      alert('Please fill in a valid name and initial balance.');
      return;
    }
    
    onUpdateWallet({
      ...wallet,
      name,
      initialBalance: parseFloat(initialBalance),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Wallet</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Name</label>
            <input
              id="walletName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <input
              id="currency"
              type="text"
              value={wallet.currency}
              readOnly
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
            />
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Currency cannot be changed after creation.</p>
          </div>
          <div>
            <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Balance ({wallet.currency})</label>
            <input
              id="initialBalance"
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
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
              Update Wallet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWalletModal;
