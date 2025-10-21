import React, { useState, useRef, useEffect } from 'react';
import { FixedDeposit, FixedDepositPurchaseType } from '../types';
import { BuildingLibraryIcon } from './icons/BuildingLibraryIcon';
import { calculateMaturityAmount } from '../utils/calculations';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface FixedDepositItemProps {
    fd: FixedDeposit;
    onEdit: (fd: FixedDeposit) => void;
    onDelete: (id: string) => void;
}

export const FixedDepositItem: React.FC<FixedDepositItemProps> = ({ fd, onEdit, onDelete }) => {
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

    const maturityAmount = fd.maturityAmount ?? calculateMaturityAmount(fd.principalAmount, fd.interestRate, fd.startDate, fd.maturityDate);

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(dateString));
    }
    
    const daysRemaining = Math.ceil((new Date(fd.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));


    return (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-start justify-between">
                 <div className="flex items-start gap-4 flex-grow">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-100 dark:bg-purple-900/50">
                        <BuildingLibraryIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{fd.bankName}</p>
                            {fd.purchaseType === FixedDepositPurchaseType.OLD && (
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
                                    Old FD
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           {fd.interestRate}% p.a. &bull; Matures on {formatDate(fd.maturityDate)}
                        </p>
                         {fd.remarks && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{fd.remarks}"</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{formatCurrency(maturityAmount)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Maturity Value</p>
                    </div>
                     <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                                <button onClick={() => { onEdit(fd); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                                <button onClick={() => { onDelete(fd.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-between items-end">
                <div>
                     <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Principal: {formatCurrency(fd.principalAmount)}</p>
                     <p className="text-xs text-gray-500 dark:text-gray-400">Invested on {formatDate(fd.startDate)}</p>
                </div>
                 {daysRemaining > 0 ? (
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{daysRemaining} days remaining</p>
                 ) : (
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">Matured</p>
                 )}
            </div>
        </div>
    );
};
