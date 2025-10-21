import React, { useState, useEffect } from 'react';
import { Debt } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface EditDebtModalProps {
  onClose: () => void;
  onUpdateDebt: (debt: Debt) => void;
  debt: Debt;
  currencies: string[];
}

const EditDebtModal: React.FC<EditDebtModalProps> = ({ onClose, onUpdateDebt, debt, currencies }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [description, setDescription] = useState('');
  const [lender, setLender] = useState('');
  const [dateIncurred, setDateIncurred] = useState('');
  const [remarks, setRemarks] = useState('');

  // Currency state
  const [currency, setCurrency] = useState(debt.currency || baseCurrency);
  const [customCurrency, setCustomCurrency] = useState('');
  const [showCustom, setShowCustom] = useState(!currencies.includes(debt.currency || baseCurrency));
  const finalCurrency = showCustom ? customCurrency : currency;
  const isForeign = finalCurrency !== baseCurrency;

  const [originalAmount, setOriginalAmount] = useState(String(debt.originalAmount || ''));
  const [amount, setAmount] = useState(String(debt.amount));

  useEffect(() => {
    if(debt) {
        setDescription(debt.description);
        setLender(debt.lender);
        setAmount(String(debt.amount));
        setOriginalAmount(String(debt.originalAmount ?? debt.amount));
        setDateIncurred(new Date(debt.dateIncurred).toISOString().split('T')[0]);
        setRemarks(debt.remarks || '');
        setCurrency(debt.currency || baseCurrency);
        if (debt.currency && !currencies.includes(debt.currency)) {
            setShowCustom(true);
            setCustomCurrency(debt.currency);
        }
    }
  }, [debt, currencies, baseCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = isForeign ? amount : originalAmount;
    if (!description.trim() || !lender.trim() || !finalAmount || parseFloat(finalAmount) <= 0) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const updatedDebt: Debt = {
      ...debt,
      description,
      lender,
      amount: parseFloat(finalAmount),
      dateIncurred: new Date(dateIncurred).toISOString(),
      remarks,
    };

    if (isForeign) {
        updatedDebt.originalAmount = parseFloat(originalAmount);
        updatedDebt.currency = finalCurrency;
    } else {
        delete updatedDebt.originalAmount;
        delete updatedDebt.currency;
    }
    
    onUpdateDebt(updatedDebt);
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Debt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
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
                        <input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full p-2 border rounded-md shadow-sm" required min="0.01" step="0.01"/>
                    </div>
                )}
            </div>
            <div>
                <label htmlFor="remarks" className="block text-sm font-medium">Remarks (Optional)</label>
                <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="mt-1 block w-full p-2 border rounded-md shadow-sm" />
            </div>
            <div className="flex justify-end pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Debt</button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default EditDebtModal;