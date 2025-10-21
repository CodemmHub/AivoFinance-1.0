
import React from 'react';
import App from './App';
import WelcomeScreen from './components/setup/WelcomeScreen';
import { useGoogleDriveData } from './context/GoogleDriveDataContext';
import { Spinner } from './components/Spinner';

interface AppControllerProps {
    userEmail: string;
    onLogout: () => void;
}

export const AppController: React.FC<AppControllerProps> = ({ userEmail, onLogout }) => {
    const { appData, isLoading, error, setBaseCurrencyAndInit } = useGoogleDriveData();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <Spinner size="lg" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your financial data...</p>
            </div>
        );
    }

    if (error) {
         return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-4">An Error Occurred</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                    Refresh Page
                </button>
            </div>
        );
    }

    if (!appData) {
        // This means no data file was found, so show the welcome/setup screen.
        return <WelcomeScreen onSetupComplete={setBaseCurrencyAndInit} />;
    }

    // Data is loaded, show the main app.
    return <App userEmail={userEmail} onLogout={onLogout} />;
};
