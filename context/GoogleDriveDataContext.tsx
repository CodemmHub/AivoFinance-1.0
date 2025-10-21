import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppData } from '../types';
import { getAppData, saveAppData } from '../services/googleDriveService';
import { Spinner } from '../components/Spinner';

// This data is used only to create categories for a new user.
// Wallets and settings are created in the WelcomeScreen.
const sampleCategories = { 
    INCOME: ['Salary', 'Freelance', 'Transfer', 'Loan', 'Other'], 
    EXPENSE: ['Groceries', 'Transport', 'Entertainment', 'Utilities', 'Subscriptions', 'Transfer', 'Investment', 'Check Payment', 'Shopping', 'Rent', 'Other'] 
};
const newUserData: AppData = {
    transactions: [],
    wallets: [],
    categories: sampleCategories,
    debts: [],
    subscriptions: [],
    assets: [],
    fixedDeposits: [],
    checks: [],
    budgets: [],
    goals: [],
};
// --- END OF SAMPLE DATA ---

interface GoogleDriveDataContextType {
    data: AppData;
    isLoading: boolean;
    error: Error | null;
    baseCurrency: string;
    updateData: (updatedData: Partial<AppData>) => void;
}

const GoogleDriveDataContext = createContext<GoogleDriveDataContextType | undefined>(undefined);

export const GoogleDriveDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [data, setData] = useState<AppData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const appData = await getAppData(newUserData);
                setData(appData);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to load data'));
                setData(newUserData); // Fallback to initial data on error
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const updateData = useCallback((updatedData: Partial<AppData>) => {
        setData(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData, ...updatedData };
            // Save to Google Drive asynchronously without blocking UI updates
            saveAppData(newData).catch(err => {
                console.error("Failed to save data to Google Drive:", err);
                // Here you might want to set an error state to notify the user
            });
            return newData;
        });
    }, []);

    if (isLoading || !data) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <Spinner size="lg" />
                    <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">Syncing with Google Drive...</p>
                </div>
            </div>
        );
    }
    
    const contextValue = {
        data: data, 
        isLoading, 
        error, 
        baseCurrency: data.userSettings?.baseCurrency || 'USD', // Default to USD if not set
        updateData 
    };

    return (
        <GoogleDriveDataContext.Provider value={contextValue}>
            {children}
        </GoogleDriveDataContext.Provider>
    );
};

export const useGoogleDriveData = () => {
    const context = useContext(GoogleDriveDataContext);
    if (context === undefined) {
        throw new Error('useGoogleDriveData must be used within a GoogleDriveDataProvider');
    }
    return context;
};
