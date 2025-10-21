import React, { useState, useRef, useEffect } from 'react';
import { Debt, DebtType } from '../types';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface DebtItemProps {
    debt: Debt;
    onEdit: (debt: Debt) => void;
    onDelete: (id: string) => void;
}

export const DebtItem: React.FC<DebtItemProps> = ({ debt, onEdit, onDelete }) => {
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
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(debt.dateIncurred));

    const formattedAmount = formatCurrency(debt.amount);
    
    const formattedOriginalAmount = debt.originalAmount && debt.currency ? 
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: debt.currency,
        }).format(debt.originalAmount) : null;

    return (
        <div className="flex items-start justify-between p-3 rounded-lg">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-yellow-100 dark:bg-yellow-900/50">
                    <CreditCardIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{debt.description}</p>
                        {debt.type === DebtType.OLD && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
                                Old Debt
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{debt.lender} &bull; {formattedDate}</p>
                    {debt.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{debt.remarks}"</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-right flex-shrink-0">
                    <p className="font-bold text-red-500">{formattedAmount}</p>
                    {formattedOriginalAmount && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formattedOriginalAmount}</p>
                    )}
                </div>
                 <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                            <button onClick={() => { onEdit(debt); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                            <button onClick={() => { onDelete(debt.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
