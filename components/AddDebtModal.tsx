import React, { useState, useEffect } from 'react';
import { Debt, DebtType, Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddDebtModalProps {
  onClose: () => void;
  onAddDebt: (debt: Omit<Debt, 'id'>, walletId?: string) => void;
  currencies: string[];
  wallets: Wallet[];
}

const AddDebtModal: React.FC<AddDebtModalProps> = ({ onClose, onAddDebt, currencies, wallets }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [description, setDescription] = useState('');
  const [lender, setLender] = useState('');
  const [dateIncurred, setDateIncurred] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [type, setType] = useState<DebtType>(DebtType.OLD);
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');

  // Currency state
  const [currency, setCurrency] = useState(baseCurrency);
  const [customCurrency, setCustomCurrency] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const finalCurrency = showCustom ? customCurrency : currency;
  const isForeign = finalCurrency !== baseCurrency;

  const [originalAmount, setOriginalAmount] = useState(''); // Amount in foreign currency
  const [amount, setAmount] = useState(''); // Amount in base currency

  useEffect(() => {
    // If currency is base, amount and originalAmount are the same
    if (!isForeign) {
      setAmount(originalAmount);
    }
  }, [originalAmount, isForeign]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = isForeign ? amount : originalAmount;
    if (!description.trim() || !lender.trim() || !finalAmount || parseFloat(finalAmount) <= 0 || (type === DebtType.CURRENT && !walletId)) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const debtData: Omit<Debt, 'id'> = {
      description,
      lender,
      amount: parseFloat(finalAmount),
      dateIncurred: new Date(dateIncurred).toISOString(),
      remarks,
      type,
    };

    if (isForeign) {
        debtData.originalAmount = parseFloat(originalAmount);
        debtData.currency = finalCurrency;
    }
    
    onAddDebt(debtData, type === DebtType.CURRENT ? walletId : undefined);
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Debt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Debt Type</label>
                <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="debtType" value={DebtType.CURRENT} checked={type === DebtType.CURRENT} onChange={() => setType(DebtType.CURRENT)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    New Debt (creates expense)
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="debtType" value={DebtType.OLD} checked={type === DebtType.OLD} onChange={() => setType(DebtType.OLD)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    Old Debt (for tracking)
                </label>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="lender" className="block text-sm font-medium">Lender</label>
                    <input id="lender" type="text" value={lender} onChange={(e) => setLender(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="dateIncurred" className="block text-sm font-medium">Date Incurred</label>
                    <input id="dateIncurred" type="date" value={dateIncurred} onChange={(e) => setDateIncurred(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required />
                </div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium">Currency</label>
                        {!showCustom ? (
                            <select id="currency" value={currency} onChange={handleCurrencyChange} className="mt-1 block w-full p-2 border rounded-md shadow-sm">
                                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="OTHER">Other (Add new)...</option>
                            </select>
                        ) : (
                            <input id="customCurrency" type="text" value={customCurrency} onChange={(e) => setCustomCurrency(e.target.value.toUpperCase())} placeholder="e.g., NZD" className="mt-1 block w-full p-2 border rounded-md shadow-sm" required maxLength={3} autoFocus />
                        )}
                    </div>
                    <div>
                        <label htmlFor="originalAmount" className="block text-sm font-medium">Amount ({finalCurrency})</label>
                        <input id="originalAmount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required min="0.01" step="0.01" />
                    </div>
                </div>
                {isForeign && (
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium">Amount in Base Currency ({baseCurrency})</label>
                        <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required min="0.01" step="0.01" placeholder="Enter equivalent in base currency"/>
                    </div>
                )}
            </div>
             {type === DebtType.CURRENT && (
                <div>
                    <label htmlFor="wallet" className="block text-sm font-medium">Record Expense From Wallet</label>
                    <select id="wallet" value={walletId} onChange={(e) => setWalletId(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required>
                        {wallets.map(w => <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>)}
                    </select>
                </div>
            )}
            <div>
                <label htmlFor="remarks" className="block text-sm font-medium">Remarks (Optional)</label>
                <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="mt-1 block w-full p-2 border rounded-md shadow-sm" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Add Debt</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddDebtModal;