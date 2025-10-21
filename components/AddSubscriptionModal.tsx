import React, { useState } from 'react';
import { Subscription, BillingCycle, Wallet, SubscriptionType } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddSubscriptionModalProps {
  onClose: () => void;
  onAddSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  wallets: Wallet[];
  categories: string[];
}

const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({ onClose, onAddSubscription, wallets, categories }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(BillingCycle.MONTHLY);
  const [firstDueDate, setFirstDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [category, setCategory] = useState(categories.includes('Subscriptions') ? 'Subscriptions' : categories[0] || '');
  const [remarks, setRemarks] = useState('');
  const [type, setType] = useState<SubscriptionType>(SubscriptionType.EXISTING);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || parseFloat(amount) <= 0 || !firstDueDate || !walletId || !category) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    onAddSubscription({
      name,
      type,
      amount: parseFloat(amount),
      billingCycle,
      nextDueDate: new Date(firstDueDate).toISOString(),
      walletId,
      category,
      remarks,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Subscription</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subscription Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="subType" value={SubscriptionType.NEW} checked={type === SubscriptionType.NEW} onChange={() => setType(SubscriptionType.NEW)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                New Subscription (pay now)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" name="subType" value={SubscriptionType.EXISTING} checked={type === SubscriptionType.EXISTING} onChange={() => setType(SubscriptionType.EXISTING)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                Existing (track future payments)
              </label>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Netflix"
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ({baseCurrency})</label>
              <input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Billing Cycle</label>
                <select
                    id="billingCycle"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                >
                    <option value={BillingCycle.MONTHLY}>Monthly</option>
                    <option value={BillingCycle.YEARLY}>Yearly</option>
                </select>
            </div>
            <div>
              <label htmlFor="firstDueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">First/Next Due Date</label>
              <input
                id="firstDueDate"
                type="date"
                value={firstDueDate}
                onChange={(e) => setFirstDueDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pay from Wallet</label>
                <select
                    id="wallet"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    required
                >
                    {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
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
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
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
                  placeholder="e.g., Family plan, shared account"
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
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
