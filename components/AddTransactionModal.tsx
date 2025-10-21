import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, Wallet, Categories } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  wallets: Wallet[];
  categories: Categories;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAddTransaction, wallets, categories }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [description, setDescription] = useState('');
  const [amountBase, setAmountBase] = useState(''); // This will hold the final amount in base currency
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [category, setCategory] = useState(categories.EXPENSE[0] || '');
  const [walletId, setWalletId] = useState(wallets.length > 0 ? wallets[0].id : '');
  const [remarks, setRemarks] = useState('');
  
  const [originalAmount, setOriginalAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');
  
  const selectedWallet = wallets.find(w => w.id === walletId);
  const isForeignCurrency = selectedWallet && selectedWallet.currency !== baseCurrency;

  useEffect(() => {
    // Reset currency fields when wallet changes
    setOriginalAmount('');
    setExchangeRate('');
    setAmountBase('');
  }, [walletId]);

  useEffect(() => {
    if (isForeignCurrency) {
      const origAmt = parseFloat(originalAmount);
      const rate = parseFloat(exchangeRate);
      if (!isNaN(origAmt) && !isNaN(rate) && rate > 0) {
        setAmountBase((origAmt * rate).toFixed(2));
      } else {
        setAmountBase('');
      }
    }
  }, [originalAmount, exchangeRate, isForeignCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = isForeignCurrency ? amountBase : originalAmount;
    if (!description || !finalAmount || parseFloat(finalAmount) <= 0 || !walletId || !category) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const transactionData: Omit<Transaction, 'id' | 'date'> = {
      description,
      amount: parseFloat(finalAmount),
      type,
      category,
      walletId,
      remarks,
    };
    
    if (isForeignCurrency && selectedWallet) {
      transactionData.originalAmount = parseFloat(originalAmount);
      transactionData.currency = selectedWallet.currency;
      transactionData.exchangeRate = parseFloat(exchangeRate);
    }
    
    onAddTransaction(transactionData);
    onClose();
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as TransactionType;
    setType(newType);
    const newCategories = newType === TransactionType.INCOME ? categories.INCOME : categories.EXPENSE;
    setCategory(newCategories[0] || '');
  };

  const availableCategories = type === TransactionType.INCOME ? categories.INCOME : categories.EXPENSE;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>

          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wallet</label>
            <select
              id="wallet"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            >
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>
              ))}
            </select>
          </div>

          {isForeignCurrency ? (
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({selectedWallet?.currency})</label>
                <input
                  id="originalAmount"
                  type="number"
                  value={originalAmount}
                  onChange={(e) => setOriginalAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required={isForeignCurrency}
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate to {baseCurrency}</label>
                <input
                  id="exchangeRate"
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required={isForeignCurrency}
                  min="0.000001"
                  step="any"
                />
              </div>
            </div>
          ) : (
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input
                  id="amount"
                  type="number"
                  value={originalAmount}
                  onChange={(e) => setOriginalAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
          )}

          {isForeignCurrency && (
             <div>
                <label htmlFor="amountBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input
                  id="amountBase"
                  type="number"
                  value={amountBase}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600"
                />
              </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                id="type"
                value={type}
                onChange={handleTypeChange}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              >
                <option value={TransactionType.EXPENSE}>Expense</option>
                <option value={TransactionType.INCOME}>Income</option>
              </select>
            </div>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              >
                {availableCategories.length > 0 ? (
                    availableCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                ) : (
                    <option value="" disabled>No categories available</option>
                )}
              </select>
            </div>
          </div>
          
           <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              placeholder="e.g., meeting with client"
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
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;
