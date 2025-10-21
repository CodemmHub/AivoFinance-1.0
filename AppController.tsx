import React from 'react';
import { useGoogleDriveData } from './context/GoogleDriveDataContext';
import App from './App';
import { WelcomeScreen } from './components/setup/WelcomeScreen';
import { Spinner } from './components/Spinner';

interface AppControllerProps {
  userEmail: string;
  onLogout: () => void;
}

export const AppController: React.FC<AppControllerProps> = ({ userEmail, onLogout }) => {
    const { data, isLoading, updateData } = useGoogleDriveData();

    const handleSetupComplete = (baseCurrency: string) => {
        const initialUserSettings = { baseCurrency };
        const initialWallet = { 
            id: 'wallet-' + new Date().toISOString(), 
            name: 'Cash', 
            currency: baseCurrency, 
            initialBalance: 0 
        };
        
        updateData({
            ...data,
            userSettings: initialUserSettings,
            wallets: [initialWallet],
        });
    };

    if (isLoading) {
         return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Your Data...</p>
                </div>
            </div>
        );
    }

    if (!data.userSettings) {
        return <WelcomeScreen onSetupComplete={handleSetupComplete} />;
    }

    return <App userEmail={userEmail} onLogout={onLogout} />;
};
