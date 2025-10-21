import { useCallback } from 'react';
import { useGoogleDriveData } from '../context/GoogleDriveDataContext';

export const useCurrencyFormatter = () => {
    const { baseCurrency } = useGoogleDriveData();

    const format = useCallback((value: number, currencyCode?: string) => {
        const code = currencyCode || baseCurrency;
        try {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: code,
            }).format(value);
        } catch (error) {
            console.warn(`Invalid currency code provided: ${code}. Falling back to USD.`);
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(value);
        }
    }, [baseCurrency]);

    return format;
};
