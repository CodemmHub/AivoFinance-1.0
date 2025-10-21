import React, { useState } from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';

interface FABMenuProps {
    onAddTransaction: () => void;
    onAddTransfer: () => void;
    onAddDebt: () => void;
    onAddSubscription: () => void;
    onAddCheck: () => void;
}

const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <div className="flex items-center justify-end gap-3">
        <span className="px-3 py-1.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-lg shadow-md">
            {label}
        </span>
        <button
            onClick={onClick}
            className="w-12 h-12 flex items-center justify-center bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            aria-label={label}
        >
            {icon}
        </button>
    </div>
);


export const FABMenu: React.FC<FABMenuProps> = ({ onAddTransaction, onAddTransfer, onAddDebt, onAddSubscription, onAddCheck }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleActionClick = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-8 right-8 z-40">
            <div className="relative flex flex-col items-end gap-4">
                <div 
                    className={`flex flex-col items-end gap-4 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                >
                    <ActionButton icon={<ReceiptPercentIcon className="w-6 h-6" />} label="Add Check" onClick={() => handleActionClick(onAddCheck)} />
                    <ActionButton icon={<CalendarDaysIcon className="w-6 h-6" />} label="Add Subscription" onClick={() => handleActionClick(onAddSubscription)} />
                    <ActionButton icon={<CreditCardIcon className="w-6 h-6" />} label="Add Debt" onClick={() => handleActionClick(onAddDebt)} />
                    <ActionButton icon={<PaperAirplaneIcon className="w-6 h-6 -rotate-45" />} label="Transfer Funds" onClick={() => handleActionClick(onAddTransfer)} />
                    <ActionButton icon={<PlusIcon className="w-6 h-6" />} label="Add Transaction" onClick={() => handleActionClick(onAddTransaction)} />
                </div>
                
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                    aria-label="Toggle Actions Menu"
                >
                    <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
            </div>
        </div>
    );
};