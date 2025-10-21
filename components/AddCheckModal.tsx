import React, { useState, useEffect } from 'react';
import { Check, Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddCheckModalProps {
  onClose: () => void;
  onAddCheck: (check: Omit<Check, 'id' | 'status'>) => void;
  wallets: Wallet[];
  categories: string[];
}

const AddCheckModal: React.FC<AddCheckModalProps> = ({ onClose, onAddCheck, wallets, categories }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [payee, setPayee] = useState('');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [category, setCategory] = useState(categories.includes('Check Payment') ? 'Check Payment' : categories[0] || '');
  const [checkNumber, setCheckNumber] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [remarks, setRemarks] = useState('');

  const [amountBase, setAmountBase] = useState('');
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

    if (!payee || !finalAmount || parseFloat(finalAmount) <= 0 || !walletId || !checkNumber || !issueDate || !dueDate || !category) {
      alert('Please fill in all required fields.');
      return;
    }
     if (new Date(dueDate) < new Date(issueDate)) {
      alert('Due date cannot be before the issue date.');
      return;
    }

    const checkData: Omit<Check, 'id' | 'status'> = {
      payee,
      amount: parseFloat(finalAmount),
      walletId,
      category,
      checkNumber,
      issueDate: new Date(issueDate).toISOString(),
      dueDate: new Date(dueDate).toISOString(),
      remarks,
    };

    if (isForeignCurrency && selectedWallet) {
      checkData.originalAmount = parseFloat(originalAmount);
      checkData.currency = selectedWallet.currency;
      checkData.exchangeRate = parseFloat(exchangeRate);
    }
    
    onAddCheck(checkData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Check</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label htmlFor="payee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payee</label>
              <input
                id="payee" type="text" value={payee} onChange={(e) => setPayee(e.target.value)}
                placeholder="e.g., Landlord"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
              />
            </div>
             <div>
              <label htmlFor="checkNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Check Number</label>
              <input
                id="checkNumber" type="text" value={checkNumber} onChange={(e) => setCheckNumber(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank (Wallet)</label>
              <select
                id="wallet" value={walletId} onChange={(e) => setWalletId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
              >
                {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>)}
              </select>
            </div>
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select
                    id="category" value={category} onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
                >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
          </div>
          
           {isForeignCurrency ? (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({selectedWallet?.currency})</label>
                  <input
                    id="originalAmount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                    required={isForeignCurrency} min="0.01" step="0.01"
                  />
                </div>
                <div>
                  <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate to {baseCurrency}</label>
                  <input
                    id="exchangeRate" type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                    required={isForeignCurrency} min="0.000001" step="any"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="amountBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input
                  id="amountBase" type="number" value={amountBase} readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600"
                />
              </div>
            </div>
          ) : (
             <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
              <input
                id="amount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                required min="0.01" step="0.01"
              />
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Issue Date</label>
              <input
                id="issueDate" type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
              />
            </div>
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
              <input
                id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required
              />
            </div>
          </div>
          
           <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
            <textarea
              id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              placeholder="e.g., Monthly rent for May"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Add Check
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCheckModal;
