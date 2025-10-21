import React, { useState, useRef, useEffect } from 'react';
import { Subscription, BillingCycle, SubscriptionType } from '../types';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { XIcon } from './icons/XIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { useCurrencyFormatter } from '../hooks/useCurrencyFormatter';

interface SubscriptionItemProps {
    subscription: Subscription;
    onPaySubscription: (subscription: Subscription) => void;
    onDeleteSubscription: (id: string) => void;
    onEditSubscription: (subscription: Subscription) => void;
}

const DueDateIndicator: React.FC<{ dueDate: string }> = ({ dueDate }) => {
    const now = new Date();
    const due = new Date(dueDate);
    // Reset time part to compare dates only
    now.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let text: string;
    let colorClasses: string;

    if (diffDays < 0) {
        text = `Overdue by ${Math.abs(diffDays)} day(s)`;
        colorClasses = 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/50';
    } else if (diffDays === 0) {
        text = 'Due today';
        colorClasses = 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50';
    } else if (diffDays <= 7) {
        text = `Due in ${diffDays} day(s)`;
        colorClasses = 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50';
    } else {
        text = `Due in ${diffDays} days`;
        colorClasses = 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700/50';
    }
    
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(new Date(dueDate));


    return (
        <div className="text-right">
            <p className={`text-sm font-semibold ${colorClasses.split(' ')[0]}`}>{text}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
        </div>
    );
};


export const SubscriptionItem: React.FC<SubscriptionItemProps> = ({ subscription, onPaySubscription, onDeleteSubscription, onEditSubscription }) => {
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
    
    const formattedAmount = formatCurrency(subscription.amount);

    return (
        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
            <div className="flex items-start gap-4 flex-grow">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50">
                    <CalendarDaysIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800 dark:text-gray-100">{subscription.name}</p>
                        {subscription.type === SubscriptionType.EXISTING && (
                             <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-200">
                                Existing
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formattedAmount} / {subscription.billingCycle === BillingCycle.MONTHLY ? 'mo' : 'yr'}
                    </p>
                    {subscription.remarks && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">"{subscription.remarks}"</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-4">
                 <DueDateIndicator dueDate={subscription.nextDueDate} />
                <button 
                    onClick={() => onPaySubscription(subscription)}
                    className="px-3 py-1.5 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors whitespace-nowrap"
                >
                    Record Payment
                </button>
                 <div className="relative" ref={menuRef}>
                    <button onClick={() => setIsMenuOpen(prev => !prev)} className="p-1 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                        <EllipsisVerticalIcon className="w-5 h-5" />
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10 border dark:border-gray-600">
                            <button onClick={() => { onEditSubscription(subscription); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600">Edit</button>
                            <button onClick={() => { onDeleteSubscription(subscription.id); setIsMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600">Delete</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
