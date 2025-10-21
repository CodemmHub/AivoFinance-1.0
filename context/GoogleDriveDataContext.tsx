import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppData } from '../types';
import { findFile, readFile, updateFile, createFile } from '../services/googleDriveService';
import { handleDataMigration } from '../services/versionService';
import { INITIAL_DATA } from '../utils/constants';

interface GoogleDriveDataContextType {
  appData: AppData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveData: (newData: AppData) => Promise<void>;
  baseCurrency: string;
  setBaseCurrencyAndInit: (currency: string) => Promise<void>;
}

const GoogleDriveDataContext = createContext<GoogleDriveDataContextType | undefined>(undefined);

export const GoogleDriveDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [appData, setAppData] = useState<AppData | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let id = await findFile();
      if (id) {
        let data = await readFile(id);
        // Run migration check
        const migratedData = await handleDataMigration(id, data);
        if (migratedData.version !== data.version) {
            // if migration happened, save the updated data back.
            await updateFile(id, migratedData);
        }
        setAppData(migratedData);
        setFileId(id);
      } else {
        // File not found, implies first-time user who needs setup.
        setAppData(null);
      }
    } catch (err: any) {
      console.error("Error loading data from Google Drive:", err);
      setError('Failed to load your financial data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const saveData = async (newData: AppData) => {
    if (!fileId) {
      console.error("Cannot save data, file ID is missing.");
      setError("Could not save data: file not found on Google Drive.");
      return;
    }
    setIsSaving(true);
    setError(null);
    // Debounce saving
    setTimeout(async () => {
      try {
        await updateFile(fileId, newData);
        setAppData(newData);
      } catch (err) {
        console.error("Error saving data:", err);
        setError("Failed to save your data. Please check your connection and try again.");
      } finally {
        setIsSaving(false);
      }
    }, 500); // 500ms debounce
  };

  const setBaseCurrencyAndInit = async (currency: string) => {
    setIsLoading(true);
    setError(null);
    try {
        const initialCurrencies = [...INITIAL_DATA.currencies];
        if (!initialCurrencies.includes(currency)) {
            initialCurrencies.push(currency);
            initialCurrencies.sort();
        }

        const initialData: AppData = {
            ...INITIAL_DATA,
            currencies: initialCurrencies,
            settings: {
                baseCurrency: currency,
            },
        };
        const newFileId = await createFile(initialData);
        setFileId(newFileId);
        setAppData(initialData);
    } catch (err: any) {
        console.error("Error initializing data:", err);
        setError("Could not create your data file. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const baseCurrency = appData?.settings.baseCurrency || 'USD';

  return (
    <GoogleDriveDataContext.Provider value={{ appData, isLoading, isSaving, error, saveData, baseCurrency, setBaseCurrencyAndInit }}>
      {children}
    </GoogleDriveDataContext.Provider>
  );
};

export const useGoogleDriveData = (): GoogleDriveDataContextType => {
  const context = useContext(GoogleDriveDataContext);
  if (context === undefined) {
    throw new Error('useGoogleDriveData must be used within a GoogleDriveDataProvider');
  }
  return context;
};