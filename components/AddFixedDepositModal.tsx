import React, { useState } from 'react';
import { FixedDeposit, FixedDepositPurchaseType, Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddFixedDepositModalProps {
  onClose: () => void;
  onAddFixedDeposit: (fd: Omit<FixedDeposit, 'id'>, walletId?: string) => void;
  wallets: Wallet[];
}

const AddFixedDepositModal: React.FC<AddFixedDepositModalProps> = ({ onClose, onAddFixedDeposit, wallets }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [bankName, setBankName] = useState('');
  const [principalAmount, setPrincipalAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [maturityDate, setMaturityDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [purchaseType, setPurchaseType] = useState<FixedDepositPurchaseType>(FixedDepositPurchaseType.CURRENT);
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCurrentAndMissingWallet = purchaseType === FixedDepositPurchaseType.CURRENT && !walletId;
    if (!bankName.trim() || !principalAmount || parseFloat(principalAmount) <= 0 || !interestRate || parseFloat(interestRate) <= 0 || !startDate || !maturityDate || isCurrentAndMissingWallet) {
      alert('Please fill in all fields with valid values.');
      return;
    }
    
    if (new Date(maturityDate) <= new Date(startDate)) {
      alert('Maturity date must be after the start date.');
      return;
    }

    const fdData: Omit<FixedDeposit, 'id'> = {
      purchaseType,
      bankName,
      principalAmount: parseFloat(principalAmount),
      interestRate: parseFloat(interestRate),
      startDate: new Date(startDate).toISOString(),
      maturityDate: new Date(maturityDate).toISOString(),
      remarks,
    };

    onAddFixedDeposit(fdData, purchaseType === FixedDepositPurchaseType.CURRENT ? walletId : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add Fixed Deposit</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Investment Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="purchaseType" value={FixedDepositPurchaseType.CURRENT} checked={purchaseType === FixedDepositPurchaseType.CURRENT} onChange={() => setPurchaseType(FixedDepositPurchaseType.CURRENT)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                Current Investment (paid now)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="purchaseType" value={FixedDepositPurchaseType.OLD} checked={purchaseType === FixedDepositPurchaseType.OLD} onChange={() => setPurchaseType(FixedDepositPurchaseType.OLD)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                Old FD (already own)
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bank Name</label>
            <input
              id="bankName"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g., National Bank"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="principalAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Principal ({baseCurrency})</label>
              <input
                id="principalAmount"
                type="number"
                value={principalAmount}
                onChange={(e) => setPrincipalAmount(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Interest Rate (%)</label>
              <input
                id="interestRate"
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
             <div>
              <label htmlFor="maturityDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maturity Date</label>
              <input
                id="maturityDate"
                type="date"
                value={maturityDate}
                onChange={(e) => setMaturityDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>
          
          {purchaseType === FixedDepositPurchaseType.CURRENT && (
              <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Invest from Wallet</label>
                <select
                  id="wallet"
                  value={walletId}
                  onChange={(e) => setWalletId(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                  required={purchaseType === FixedDepositPurchaseType.CURRENT}
                >
                  {wallets.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.currency})</option>
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
              placeholder="e.g., Certificate #12345"
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
              Add Fixed Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFixedDepositModal;
