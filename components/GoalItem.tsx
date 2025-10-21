import React, { useState, useRef, useEffect } from 'react';
import { Goal } from '../types';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { ArrowUpOnSquareIcon } from './icons/ArrowUpOnSquareIcon';

interface GoalItemProps {
    goal: Goal;
    onEdit: (goal: Goal) => void;
    onDelete: (id: string) => void;
    onUpdateProgress: (goal: Goal) => void;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal, onEdit, onDelete, onUpdateProgress }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const percentage = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0;
    const cappedPercentage = Math.min(percentage, 100);

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(amount);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">{goal.name}</h3>
                <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 -mr-2 -mt-2 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                            <button onClick={() => { onEdit(goal); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                            <button onClick={() => { onDelete(goal.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow space-y-2">
                <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Saved</span>
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(goal.savedAmount)}</span>
                </div>
                 <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Target</span>
                    <span className="text-base font-medium text-gray-700 dark:text-gray-300">{formatCurrency(goal.targetAmount)}</span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${cappedPercentage}%` }}></div>
                </div>
                 <div className="text-right text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {percentage.toFixed(1)}% Complete
                </div>
            </div>

            <button
                onClick={() => onUpdateProgress(goal)}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
                <ArrowUpOnSquareIcon className="w-5 h-5" />
                Add / Withdraw Funds
            </button>
        </div>
    );
};