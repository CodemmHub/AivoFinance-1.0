import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Budget, Transaction } from '../types';
import { calculateBudgetUsage } from '../utils/calculations';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface BudgetItemProps {
    budget: Budget;
    transactions: Transaction[];
    onEdit: (budget: Budget) => void;
    onDelete: (id: string) => void;
}

export const BudgetItem: React.FC<BudgetItemProps> = ({ budget, transactions, onEdit, onDelete }) => {
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

    const { spent, remaining, percentage } = useMemo(() => calculateBudgetUsage(budget, transactions), [budget, transactions]);
    
    const progressBarColor = percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800 dark:text-gray-100">{budget.category}</p>
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {formatCurrency(spent)} / <span className="text-gray-500 dark:text-gray-400">{formatCurrency(budget.amount)}</span>
                    </p>
                    <div className="relative" ref={menuRef}>
                        <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                            <EllipsisVerticalIcon className="w-5 h-5" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                                <button onClick={() => { onEdit(budget); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                                <button onClick={() => { onDelete(budget.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div className={`${progressBarColor} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="text-right text-xs mt-1 font-medium text-gray-500 dark:text-gray-400">
                {formatCurrency(remaining)} remaining
            </div>
        </div>
    );
};
