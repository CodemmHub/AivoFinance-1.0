import React, { useState, useRef, useEffect } from 'react';
import { Asset, AssetType, AssetPurchaseType } from '../types';
import { HomeIcon } from './icons/HomeIcon';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface AssetItemProps {
    asset: Asset;
    onEdit: (asset: Asset) => void;
    onDelete: (id: string) => void;
}

const getAssetIcon = (type: AssetType) => {
    switch(type) {
        case AssetType.REAL_ESTATE:
            return <HomeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />;
        case AssetType.STOCKS:
            return <BanknotesIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
        case AssetType.CRYPTO:
             return <SparklesIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
        default:
            return <div className="w-5 h-5" />;
    }
}

const getAssetBgColor = (type: AssetType) => {
     switch(type) {
        case AssetType.REAL_ESTATE:
            return 'bg-green-100 dark:bg-green-900/50';
        case AssetType.STOCKS:
            return 'bg-blue-100 dark:bg-blue-900/50';
        case AssetType.CRYPTO:
             return 'bg-yellow-100 dark:bg-yellow-900/50';
        default:
            return 'bg-gray-100 dark:bg-gray-900/50';
    }
}

export const AssetItem: React.FC<AssetItemProps> = ({ asset, onEdit, onDelete }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const formatCurrency = useCurrencyFormatter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formattedValue = formatCurrency(asset.currentValue);

    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(asset.purchaseDate));

    return (
        <div className="flex items-start justify-between p-3 rounded-lg">
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getAssetBgColor(asset.type)}`}>
                   {getAssetIcon(asset.type)}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{asset.name}</p>
                        {asset.purchaseType === AssetPurchaseType.OLD && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
                                Old Asset
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{asset.type} &bull; Purchased: {formattedDate}</p>
                     {asset.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{asset.remarks}"</p>
                    )}
                </div>
            </div>
             <div className="flex items-center gap-2">
                <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{formattedValue}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Current Value</p>
                </div>
                 <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                            <button onClick={() => { onEdit(asset); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                            <button onClick={() => { onDelete(asset.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
