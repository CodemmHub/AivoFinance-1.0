import React from 'react';
import { Asset } from '../types';
import { AssetItem } from './AssetItem';
import { PlusIcon } from './icons/PlusIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface AssetsViewProps {
  assets: Asset[];
  onAddAsset: () => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (id: string) => void;
}

const AssetsView: React.FC<AssetsViewProps> = ({ assets, onAddAsset, onEditAsset, onDeleteAsset }) => {
  const totalAssetsValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const formatCurrency = useCurrencyFormatter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Assets</h1>
        <button
          onClick={onAddAsset}
          className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Asset
        </button>
      </div>

       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Total Asset Value</h2>
        <p className="text-4xl font-bold text-gray-800 dark:text-white">{formatCurrency(totalAssetsValue)}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <div className="space-y-2">
            {assets.length > 0 ? (
                assets.map(asset => (
                    <AssetItem key={asset.id} asset={asset} onEdit={onEditAsset} onDelete={onDeleteAsset} />
                ))
            ) : (
                <div className="text-center py-16">
                    <BanknotesIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="font-semibold text-lg text-gray-600 dark:text-gray-300">No assets recorded.</p>
                    <p className="text-gray-500 dark:text-gray-400">Click "Add Asset" to track your investments.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AssetsView;
