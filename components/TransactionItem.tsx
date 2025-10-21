import React, { useState, useRef, useEffect } from 'react';
import { Transaction, TransactionType, Wallet } from '../types';
import { ArrowDownLeftIcon } from './icons/ArrowDownLeftIcon';
import { ArrowUpRightIcon } from './icons/ArrowUpRightIcon';
import { WalletIcon } from './icons/WalletIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface TransactionItemProps {
    transaction: Transaction;
    wallets: Wallet[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

const getCategoryStyle = (category: string) => {
    const hash = category.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const hue = hash % 360;
    return {
        backgroundColor: `hsl(${hue}, 70%, 90%)`,
        color: `hsl(${hue}, 80%, 25%)`,
        darkBackgroundColor: `hsl(${hue}, 30%, 20%)`,
        darkColor: `hsl(${hue}, 60%, 80%)`,
    };
};


export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction, wallets, onEdit, onDelete }) => {
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

    const isIncome = transaction.type === TransactionType.INCOME;
    const isTransfer = transaction.category === 'Transfer';
    const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
    const amountSign = isIncome ? '+' : '-';
    
    const categoryStyle = getCategoryStyle(transaction.category);
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(transaction.date));
    
    const wallet = wallets.find(w => w.id === transaction.walletId);
    
    const displayAmount = transaction.originalAmount ?? transaction.amount;
    const displayCurrency = transaction.currency ?? undefined; // Pass wallet's currency code to formatter

    const formattedAmount = formatCurrency(displayAmount, displayCurrency);
    const formattedBaseAmount = (transaction.currency && transaction.currency !== formatCurrency(0).replace(/[\d.,\s]/g, '')) ? formatCurrency(transaction.amount) : null;


    return (
        <div className="flex items-start justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isTransfer ? 'bg-gray-100 dark:bg-gray-700' : (isIncome ? 'bg-green-100 dark:bg-green-900/50' : 'bg-red-100 dark:bg-red-900/50')}`}>
                    {isTransfer ? 
                        <ArrowPathIcon className="w-5 h-5 text-gray-600 dark:text-gray-400"/> :
                        isIncome ? 
                        <ArrowUpRightIcon className="w-5 h-5 text-green-600 dark:text-green-400"/> : 
                        <ArrowDownLeftIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    }
                </div>
                <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{transaction.description}</p>
                     {transaction.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{transaction.remarks}"</p>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>{formattedDate}</span>
                        {wallet && (
                           <>
                            <span className="text-gray-300 dark:text-gray-600">|</span>
                            <div className="flex items-center gap-1">
                                <WalletIcon className="w-3 h-3"/>
                                <span>{wallet.name}</span>
                            </div>
                           </>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-right flex-shrink-0">
                    <p className={`font-bold ${isTransfer ? 'text-gray-700 dark:text-gray-300' : amountColor}`}>{`${isTransfer ? '' : amountSign}${formattedAmount}`}</p>
                    {formattedBaseAmount && (
                        <p className="text-xs text-gray-400 dark:text-gray-500">~ {formattedBaseAmount}</p>
                    )}
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block" style={{ backgroundColor: categoryStyle.backgroundColor, color: categoryStyle.color }}>
                    <span className="dark:hidden">{transaction.category}</span>
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full mt-1 hidden" style={{ backgroundColor: categoryStyle.darkBackgroundColor, color: categoryStyle.darkColor }}>
                    <span className="dark:inline">{transaction.category}</span>
                    </span>
                </div>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                            <button onClick={() => { onEdit(transaction); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                            <button onClick={() => { onDelete(transaction.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
