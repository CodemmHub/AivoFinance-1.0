import React, { useState, useEffect } from 'react';
import { Debt, CURRENCIES, Wallet, DebtType } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddDebtModalProps {
  onClose: () => void;
  onAddDebt: (debt: Omit<Debt, 'id'>, walletId?: string) => void;
  wallets: Wallet[];
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ onClose, onAddDebt, wallets }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [description, setDescription] = useState('');
  const [lender, setLender] = useState('');
  const [amount, setAmount] = useState('');
  const [dateIncurred, setDateIncurred] = useState(new Date().toISOString().split('T')[0]);
  const [walletId, setWalletId] = useState(wallets.length > 0 ? wallets[0].id : '');
  const [remarks, setRemarks] = useState('');
  const [debtType, setDebtType] = useState<DebtType>(DebtType.CURRENT);

  const [currency, setCurrency] = useState(baseCurrency);
  const [originalAmount, setOriginalAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');

  const isForeignCurrency = currency !== baseCurrency;

  useEffect(() => {
    if (isForeignCurrency) {
      const origAmt = parseFloat(originalAmount);
      const rate = parseFloat(exchangeRate);
      if (!isNaN(origAmt) && !isNaN(rate) && rate > 0) {
        setAmount((origAmt * rate).toFixed(2));
      } else {
        setAmount('');
      }
    } else {
        setAmount(originalAmount);
    }
  }, [originalAmount, exchangeRate, isForeignCurrency, currency]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCurrentAndMissingWallet = debtType === DebtType.CURRENT && !walletId;
    if (!description || !lender || !amount || parseFloat(amount) <= 0 || !dateIncurred || isCurrentAndMissingWallet) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const debtData: Omit<Debt, 'id'> = {
        description,
        lender,
        type: debtType,
        amount: parseFloat(amount),
        dateIncurred: new Date(dateIncurred).toISOString(),
        remarks,
    };

    if (isForeignCurrency) {
      debtData.originalAmount = parseFloat(originalAmount);
      debtData.currency = currency;
      debtData.exchangeRate = parseFloat(exchangeRate);
    }
    
    onAddDebt(debtData, debtType === DebtType.CURRENT ? walletId : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Debt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Debt</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="debtType" value={DebtType.CURRENT} checked={debtType === DebtType.CURRENT} onChange={() => setDebtType(DebtType.CURRENT)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    Current Debt (receiving money now)
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="debtType" value={DebtType.OLD} checked={debtType === DebtType.OLD} onChange={() => setDebtType(DebtType.OLD)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    Old Debt (already spent)
                </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Student Loan"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
            <div>
                <label htmlFor="lender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lender</label>
                <input
                  id="lender"
                  type="text"
                  value={lender}
                  onChange={(e) => setLender(e.target.value)}
                  placeholder="e.g., Bank, Friend's Name"
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required
                />
              </div>
          </div>


           <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <select
              id="currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

           {isForeignCurrency ? (
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({currency})</label>
                <input
                  id="originalAmount"
                  type="number"
                  value={originalAmount}
                  onChange={(e) => setOriginalAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required
                  min="0.01"
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exchange Rate</label>
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
              <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
              <input id="originalAmount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required min="0.01" step="0.01"/>
            </div>
          )}
           
           <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input
                  id="amount"
                  type="number"
                  value={amount}
                  readOnly
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600"
                />
            </div>
             <div>
              <label htmlFor="dateIncurred" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Incurred</label>
              <input
                id="dateIncurred"
                type="date"
                value={dateIncurred}
                onChange={(e) => setDateIncurred(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
           </div>
            
            {debtType === DebtType.CURRENT && (
                <div>
                  <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deposit to Wallet</label>
                  <select
                    id="wallet"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    required={debtType === DebtType.CURRENT}
                  >
                    {wallets.map(w => (
                      <option key={w.id} value={w.id}>{w.name}</option>
                    ))}
                  </select>
                </div>
            )}
            
            <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
                <textarea
                  id="remarks"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={2}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  placeholder="e.g., 0% interest for first year"
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
              Add Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;
