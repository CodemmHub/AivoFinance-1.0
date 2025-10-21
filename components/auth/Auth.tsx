import React, { useState } from 'react';
import { signIn } from '../../services/googleAuthService';
import { BanknotesIcon } from '../icons/BanknotesIcon';
import { GoogleIcon } from '../icons/GoogleIcon';
import { Spinner } from '../Spinner';

const Auth: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await signIn();
            // The onAuthStateChanged listener in Root.tsx will handle the navigation
        } catch (err) {
            setError('Failed to sign in. Please try again.');
            setIsLoading(false);
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl text-center">
                <div className="flex flex-col items-center">
                    <div className="p-3 bg-blue-600 rounded-full mb-4">
                        <BanknotesIcon className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome to FinTrack</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Your personal finance companion.</p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? (
                            <Spinner size="sm" />
                        ) : (
                            <GoogleIcon className="w-6 h-6" />
                        )}
                        <span>{isLoading ? 'Signing in...' : 'Sign in with Google'}</span>
                    </button>
                    {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 pt-4">
                    By signing in, you agree to store your application data securely in your own Google Drive.
                </p>
            </div>
        </div>
    );
};

export default Auth;
