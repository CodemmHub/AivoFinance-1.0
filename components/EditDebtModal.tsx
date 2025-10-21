import React, { useState, useEffect } from 'react';
import { Debt, CURRENCIES, Wallet, DebtType } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface EditDebtModalProps {
  onClose: () => void;
  onUpdateDebt: (debt: Debt) => void;
  wallets: Wallet[];
  debt: Debt;
}

const EditDebtModal: React.FC<EditDebtModalProps> = ({ onClose, onUpdateDebt, wallets, debt }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [description, setDescription] = useState('');
  const [lender, setLender] = useState('');
  const [amount, setAmount] = useState('');
  const [dateIncurred, setDateIncurred] = useState('');
  const [remarks, setRemarks] = useState('');
  const [currency, setCurrency] = useState(baseCurrency);
  const [originalAmount, setOriginalAmount] = useState('');
  const [exchangeRate, setExchangeRate] = useState('');

  const isForeignCurrency = currency !== baseCurrency;

  useEffect(() => {
      setDescription(debt.description);
      setLender(debt.lender);
      setAmount(String(debt.amount));
      setDateIncurred(new Date(debt.dateIncurred).toISOString().split('T')[0]);
      setRemarks(debt.remarks || '');
      setCurrency(debt.currency || baseCurrency);
      setOriginalAmount(String(debt.originalAmount ?? debt.amount));
      setExchangeRate(String(debt.exchangeRate ?? ''));
  }, [debt, baseCurrency]);

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
        setAmount(originalAmount); // If not foreign, base amount is original amount
    }
  }, [originalAmount, exchangeRate, isForeignCurrency]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = isForeignCurrency ? amount : originalAmount;
    if (!description || !lender || !finalAmount || parseFloat(finalAmount) <= 0 || !dateIncurred) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const debtData: Debt = {
        ...debt,
        description,
        lender,
        amount: parseFloat(finalAmount),
        dateIncurred: new Date(dateIncurred).toISOString(),
        remarks,
    };

    if (isForeignCurrency) {
      debtData.originalAmount = parseFloat(originalAmount);
      debtData.currency = currency;
      debtData.exchangeRate = parseFloat(exchangeRate);
    } else {
        delete debtData.originalAmount;
        delete debtData.currency;
        delete debtData.exchangeRate;
    }
    
    onUpdateDebt(debtData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Debt</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type of Debt</label>
            <p className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                {debt.type === DebtType.CURRENT ? "Current Debt (receiving money now)" : "Old Debt (already spent)"}
                <br />
                <span className="text-xs italic">Debt type cannot be changed after creation.</span>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
            </div>
            <div>
                <label htmlFor="lender" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lender</label>
                <input id="lender" type="text" value={lender} onChange={(e) => setLender(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
              </div>
          </div>


           <div>
            <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Currency</label>
            <select id="currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm">
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

           {isForeignCurrency ? (
            <div className="grid grid-cols-2 gap-4">
               <div>
                <label htmlFor="originalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({currency})</label>
                <input id="originalAmount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required={isForeignCurrency} min="0.01" step="0.01" />
              </div>
              <div>
                <label htmlFor="exchangeRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Exchange Rate</label>
                <input id="exchangeRate" type="number" value={exchangeRate} onChange={(e) => setExchangeRate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required={isForeignCurrency} min="0.000001" step="any" />
              </div>
            </div>
          ) : (
             <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input id="amount" type="number" value={originalAmount} onChange={(e) => setOriginalAmount(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required min="0.01" step="0.01" />
            </div>
          )}
           
           <div className="grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="amountBase" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
                <input id="amountBase" type="number" value={amount} readOnly className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-600" />
            </div>
             <div>
              <label htmlFor="dateIncurred" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date Incurred</label>
              <input id="dateIncurred" type="date" value={dateIncurred} onChange={(e) => setDateIncurred(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
            </div>
           </div>
            
            <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
                <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
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
