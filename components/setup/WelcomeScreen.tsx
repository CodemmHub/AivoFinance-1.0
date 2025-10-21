import React, { useState } from 'react';
import { BanknotesIcon } from '../icons/BanknotesIcon';
import { Spinner } from '../Spinner';
import { DEFAULT_CURRENCIES } from '../../utils/constants';

interface WelcomeScreenProps {
    onSetupComplete: (currency: string) => Promise<void>;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetupComplete }) => {
    const [currency, setCurrency] = useState('USD');
    const [customCurrency, setCustomCurrency] = useState('');
    const [showCustom, setShowCustom] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalCurrency = showCustom ? customCurrency : currency;
        if (!finalCurrency || finalCurrency.length !== 3) {
            alert('Please enter a valid 3-letter currency code (e.g., USD, EUR, JPY).');
            return;
        }
        setIsLoading(true);
        await onSetupComplete(finalCurrency.toUpperCase());
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === 'OTHER') {
            setShowCustom(true);
            setCurrency('');
        } else {
            setShowCustom(false);
            setCurrency(value);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-600 rounded-full mb-4">
                        <BanknotesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to AivoFinance</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Let's get your finances set up.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="currency" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                            What's your base currency?
                        </label>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-4">
                            All reports and totals will be shown in this currency.
                        </p>
                        
                        {!showCustom ? (
                             <select
                                id="currency"
                                value={currency}
                                onChange={handleCurrencyChange}
                                className="mt-1 block w-full max-w-xs mx-auto p-3 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                            >
                                {DEFAULT_CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                                <option value="OTHER">Other (Add new)...</option>
                            </select>
                        ) : (
                             <input
                                id="customCurrency"
                                type="text"
                                value={customCurrency}
                                onChange={(e) => setCustomCurrency(e.target.value.toUpperCase())}
                                maxLength={3}
                                placeholder="e.g., NZD"
                                className="mt-1 block w-full max-w-xs mx-auto p-3 text-center text-lg font-semibold border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
                                required
                                autoFocus
                            />
                        )}
                       
                    </div>
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full max-w-xs mx-auto flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? <Spinner size="sm" /> : null}
                        <span>{isLoading ? 'Setting up...' : "Let's Go!"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default WelcomeScreen;