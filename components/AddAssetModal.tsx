import React, { useState } from 'react';
import { Asset, AssetType, AssetPurchaseType, Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface AddAssetModalProps {
  onClose: () => void;
  onAddAsset: (asset: Omit<Asset, 'id'>, walletId?: string) => void;
  wallets: Wallet[];
}

const AddAssetModal: React.FC<AddAssetModalProps> = ({ onClose, onAddAsset, wallets }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>(AssetType.STOCKS);
  const [purchaseType, setPurchaseType] = useState<AssetPurchaseType>(AssetPurchaseType.CURRENT);
  const [currentValue, setCurrentValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [remarks, setRemarks] = useState('');
  const [walletId, setWalletId] = useState(wallets.length > 0 ? wallets[0].id : '');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCurrentAndMissingWallet = purchaseType === AssetPurchaseType.CURRENT && !walletId;
    if (!name.trim() || !currentValue || parseFloat(currentValue) < 0 || !purchaseDate || isCurrentAndMissingWallet) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    const assetData: Omit<Asset, 'id'> = {
      name,
      type,
      purchaseType,
      currentValue: parseFloat(currentValue),
      purchaseDate: new Date(purchaseDate).toISOString(),
      remarks,
    };

    onAddAsset(assetData, purchaseType === AssetPurchaseType.CURRENT ? walletId : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md m-4 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <XIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Add New Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Type</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="purchaseType" value={AssetPurchaseType.CURRENT} checked={purchaseType === AssetPurchaseType.CURRENT} onChange={() => setPurchaseType(AssetPurchaseType.CURRENT)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    Current Purchase (paid now)
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="purchaseType" value={AssetPurchaseType.OLD} checked={purchaseType === AssetPurchaseType.OLD} onChange={() => setPurchaseType(AssetPurchaseType.OLD)} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300" />
                    Old Asset (already own)
                </label>
            </div>
          </div>
          <div>
            <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name</label>
            <input
              id="assetName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Apple Inc. Shares"
              className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Type</label>
              <select
                id="assetType"
                value={type}
                onChange={(e) => setType(e.target.value as AssetType)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              >
                {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Value ({baseCurrency})</label>
              <input
                id="currentValue"
                type="number"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
                min="0"
                step="0.01"
                placeholder={purchaseType === AssetPurchaseType.CURRENT ? 'Purchase Price' : 'Current Value'}
              />
            </div>
          </div>
           <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</label>
              <input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                required
              />
            </div>
            
            {purchaseType === AssetPurchaseType.CURRENT && (
                <div>
                  <label htmlFor="wallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase from Wallet</label>
                  <select
                    id="wallet"
                    value={walletId}
                    onChange={(e) => setWalletId(e.target.value)}
                    className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                    required={purchaseType === AssetPurchaseType.CURRENT}
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
                  placeholder="e.g., 10 shares bought via broker"
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
              Add Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;
