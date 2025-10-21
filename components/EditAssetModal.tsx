import React, { useState, useEffect } from 'react';
import { Asset, AssetType, AssetPurchaseType, Wallet } from '../types';
import { XIcon } from './icons/XIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface EditAssetModalProps {
  onClose: () => void;
  onUpdateAsset: (asset: Asset) => void;
  wallets: Wallet[];
  asset: Asset;
}

const EditAssetModal: React.FC<EditAssetModalProps> = ({ onClose, onUpdateAsset, wallets, asset }) => {
  const { baseCurrency } = useGoogleDriveData();
  const [name, setName] = useState('');
  const [type, setType] = useState<AssetType>(AssetType.STOCKS);
  const [currentValue, setCurrentValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [remarks, setRemarks] = useState('');
  
  useEffect(() => {
    setName(asset.name);
    setType(asset.type);
    setCurrentValue(String(asset.currentValue));
    setPurchaseDate(new Date(asset.purchaseDate).toISOString().split('T')[0]);
    setRemarks(asset.remarks || '');
  }, [asset]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !currentValue || parseFloat(currentValue) < 0 || !purchaseDate) {
      alert('Please fill in all fields with valid values.');
      return;
    }

    onUpdateAsset({
      ...asset,
      name,
      type,
      currentValue: parseFloat(currentValue),
      purchaseDate: new Date(purchaseDate).toISOString(),
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Asset</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Purchase Type</label>
             <p className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                {asset.purchaseType === AssetPurchaseType.CURRENT ? "Current Purchase (paid now)" : "Old Asset (already own)"}
                <br />
                <span className="text-xs italic">Purchase type cannot be changed after creation.</span>
            </p>
          </div>
          <div>
            <label htmlFor="assetName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name</label>
            <input id="assetName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="assetType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Type</label>
              <select id="assetType" value={type} onChange={(e) => setType(e.target.value as AssetType)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" >
                {Object.values(AssetType).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Value ({baseCurrency})</label>
              <input id="currentValue" type="number" value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required min="0" step="0.01" />
            </div>
          </div>
           <div>
              <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Purchase Date</label>
              <input id="purchaseDate" type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
            </div>

            <div>
                <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Remarks (Optional)</label>
                <textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
            </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Update Asset</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssetModal;
