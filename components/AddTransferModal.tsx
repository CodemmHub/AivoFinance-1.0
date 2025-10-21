import React, { useState, useMemo } from 'react';
import { Wallet, Transaction } from '../types';
import { XIcon } from './icons/XIcon';
import { calculateWalletBalance } from '../utils/calculations';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddTransferModalProps {
  onClose: () => void;
  onTransfer: (
    fromWalletId: string, 
    toWalletId: string, 
    fromAmount: number, 
    toAmount: number, 
    fromExchangeRate: number, 
    toExchangeRate: number, 
    remarks: string
  ) => void;
  wallets: Wallet[];
  transactions: Transaction[];
}

const AddTransferModal: React.FC<AddTransferModalProps> = ({ onClose, onTransfer, wallets, transactions }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [fromWalletId, setFromWalletId] = useState(wallets[0]?.id || '');
  const [toWalletId, setToWalletId] = useState(wallets[1]?.id || '');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromExchangeRate, setFromExchangeRate] = useState('1');
  const [toExchangeRate, setToExchangeRate] = useState('1');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fromWallet = useMemo(() => wallets.find(w => w.id === fromWalletId), [fromWalletId, wallets]);
  const toWallet = useMemo(() => wallets.find(w => w.id === toWalletId), [toWalletId, wallets]);

  const fromWalletBalance = useMemo(() => {
    if (!fromWallet) return 0;
    return calculateWalletBalance(fromWallet, transactions);
  }, [fromWallet, transactions]);

  const formatCurrency = (value: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

  const isFromForeign = fromWallet?.currency !== baseCurrency;
  const isToForeign = toWallet?.currency !== baseCurrency;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fromAmt = parseFloat(fromAmount);
    const toAmt = parseFloat(toAmount);
    const fromRate = parseFloat(fromExchangeRate);
    const toRate = parseFloat(toExchangeRate);

    if (!fromWalletId || !toWalletId || !fromAmount || fromAmt <= 0 || !toAmount || toAmt <= 0) {
      setError('Please fill in all fields with valid values.');
      return;
    }
    if (fromWalletId === toWalletId) {
      setError('Source and destination wallets cannot be the same.');
      return;
    }
    if (fromAmt > fromWalletBalance) {
      setError(`Insufficient funds. Current balance is ${formatCurrency(fromWalletBalance, fromWallet?.currency || baseCurrency)}.`);
      return;
    }
    if ((isFromForeign && !fromRate) || (isToForeign && !toRate)) {
        setError('Please provide exchange rates for foreign currency wallets.');
        return;
    }
    
    onTransfer(fromWalletId, toWalletId, fromAmt, toAmt, isFromForeign ? fromRate : 1, isToForeign ? toRate : 1, remarks);
    onClose();
  };
  
  const toWallets = wallets.filter(w => w.id !== fromWalletId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Transfer Funds</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fromWallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">From Wallet</label>
              <select
                id="fromWallet"
                value={fromWalletId}
                onChange={(e) => setFromWalletId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              >
                {wallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>
                ))}
              </select>
              {fromWallet && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Balance: {formatCurrency(fromWalletBalance, fromWallet.currency)}</p>}
            </div>
            <div>
              <label htmlFor="toWallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">To Wallet</label>
              <select
                id="toWallet"
                value={toWalletId}
                onChange={(e) => setToWalletId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              >
                {toWallets.map(w => (
                  <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount to Send ({fromWallet?.currency})</label>
                <input
                  id="fromAmount" type="number" value={fromAmount} onChange={(e) => setFromAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                  required min="0.01" step="0.01"
                />
              </div>
               {isFromForeign && (
                   <div>
                    <label htmlFor="fromExchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate to {baseCurrency}</label>
                    <input
                      id="fromExchangeRate" type="number" value={fromExchangeRate} onChange={(e) => setFromExchangeRate(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                      required min="0.000001" step="any"
                    />
                  </div>
               )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="toAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount Received ({toWallet?.currency})</label>
                <input
                  id="toAmount" type="number" value={toAmount} onChange={(e) => setToAmount(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                  required min="0.01" step="0.01"
                />
              </div>
              {isToForeign && (
                   <div>
                    <label htmlFor="toExchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Rate to {baseCurrency}</label>
                    <input
                      id="toExchangeRate" type="number" value={toExchangeRate} onChange={(e) => setToExchangeRate(e.target.value)}
                      className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
                      required min="0.000001" step="any"
                    />
                  </div>
               )}
          </div>

          <div>
            <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
            <textarea
              id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)}
              rows={2} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              placeholder="e.g., ATM cash withdrawal"
            />
          </div>
          
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          
          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransferModal;
