import React from 'react';
import { Check, CheckStatus, Wallet } from '../types';
import { ReceiptPercentIcon } from './icons/ReceiptPercentIcon';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

interface CheckItemProps {
    check: Check;
    wallets: Wallet[];
    onUpdateCheckStatus: (checkId: string, newStatus: CheckStatus) => void;
}

const StatusBadge: React.FC<{ status: CheckStatus }> = ({ status }) => {
    const styles = {
        [CheckStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        [CheckStatus.CLEARED]: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        [CheckStatus.BOUNCED]: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        [CheckStatus.CANCELED]: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    };
    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};


export const CheckItem: React.FC<CheckItemProps> = ({ check, wallets, onUpdateCheckStatus }) => {
    const { baseCurrency } = useGoogleDriveData();
    const wallet = wallets.find(w => w.id === check.walletId);

    const formatCurrency = (amount: number, currency: string) => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
    const formatDate = (dateString: string) => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(dateString));
    
    const displayCurrency = check.currency || baseCurrency;
    const displayAmount = check.originalAmount ?? check.amount;

    const formattedAmount = formatCurrency(displayAmount, displayCurrency);
    const formattedBaseAmount = (check.currency && check.currency !== baseCurrency) ? formatCurrency(check.amount, baseCurrency) : null;

    return (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                        <ReceiptPercentIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <p className="font-semibold text-gray-800 dark:text-gray-100">{check.payee}</p>
                            <StatusBadge status={check.status} />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           Due: {formatDate(check.dueDate)} &bull; From: {wallet?.name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                           Check #{check.checkNumber}
                        </p>
                    </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    <p className="font-bold text-lg text-red-500">{formattedAmount}</p>
                    {formattedBaseAmount && (
                     <p className="text-xs text-gray-400 dark:text-gray-500">~ {formattedBaseAmount}</p>
                 )}
                </div>
            </div>
            {check.status === CheckStatus.PENDING && (
                 <div className="mt-3 flex justify-end gap-2">
                    <button 
                        onClick={() => onUpdateCheckStatus(check.id, CheckStatus.CANCELED)}
                        className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                    >
                        Mark Canceled
                    </button>
                    <button 
                        onClick={() => onUpdateCheckStatus(check.id, CheckStatus.BOUNCED)}
                        className="px-3 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded-md hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900"
                    >
                        Mark Bounced
                    </button>
                    <button 
                        onClick={() => onUpdateCheckStatus(check.id, CheckStatus.CLEARED)}
                        className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-md hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900"
                    >
                        Mark Cleared
                    </button>
                </div>
            )}
        </div>
    );
};
