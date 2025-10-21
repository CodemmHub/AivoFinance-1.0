import React, { useState } from 'react';
import { CURRENCIES } from '../../types';
import { BanknotesIcon } from '../icons/BanknotesIcon';

interface WelcomeScreenProps {
    onSetupComplete: (baseCurrency: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSetupComplete }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);

    const handleSubmit = () => {
        onSetupComplete(selectedCurrency);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-lg p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-600 rounded-full mb-4">
                        <BanknotesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to FinTrack!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Let's get your account set up.</p>
                </div>
                
                <div className="space-y-4 text-left">
                     <label htmlFor="currency" className="block text-lg font-medium text-gray-700 dark:text-gray-300 text-center">
                        Select your primary currency
                    </label>
                     <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                        This will be the main currency for all your reports and summaries.
                    </p>
                    <select
                        id="currency"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-lg"
                    >
                        {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};
