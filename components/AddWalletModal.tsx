import React, { useState } from 'react';
import { Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddWalletModalProps {
  onClose: () => void;
  onAddWallet: (wallet: Omit<Wallet, 'id'>) => void;
  currencies: string[];
}

const AddWalletModal: React.FC<AddWalletModalProps> = ({ onClose, onAddWallet, currencies }) => {
    const { baseCurrency } = useGoogleDriveData();
    const [name, setName] = useState('');
    const [initialBalance, setInitialBalance] = useState('0');
    const [currency, setCurrency] = useState(baseCurrency);
    const [customCurrency, setCustomCurrency] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalCurrency = (showCustom ? customCurrency : currency).toUpperCase();
        if (!name.trim() || !finalCurrency || finalCurrency.length !== 3 || isNaN(parseFloat(initialBalance))) {
        alert('Please fill in all fields with valid values (e.g., a 3-letter currency code like USD).');
        return;
        }
        
        onAddWallet({
        name,
        initialBalance: parseFloat(initialBalance),
        currency: finalCurrency,
        });
        onClose();
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setShowCustom(true);
            setCurrency('');
        } else {
            setShowCustom(false);
            setCurrency(value);
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Wallet</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="walletName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet Name</label>
                <input id="walletName" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Cash" className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Initial Balance</label>
                <input id="initialBalance" type="number" value={initialBalance} onChange={(e) => setInitialBalance(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700" required step="0.01" />
                </div>
                <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
                {!showCustom ? (
                    <select
                        id="currency"
                        value={currency}
                        onChange={handleCurrencyChange}
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    >
                        {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                        <option value="OTHER">Other (Add new)...</option>
                    </select>
                ) : (
                    <input
                        id="customCurrency"
                        type="text"
                        value={customCurrency}
                        onChange={(e) => setCustomCurrency(e.target.value.toUpperCase())}
                        placeholder="e.g., NZD"
                        className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                        required maxLength={3} autoFocus
                    />
                )}
                </div>
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Wallet</button>
            </div>
            </form>
        </div>
        </div>
    );
};

export default AddWalletModal;