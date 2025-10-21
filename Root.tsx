import React, { useState, useEffect } from 'react';
import App from './App';
import Auth from './components/auth/Auth';
import { onAuthStateChanged, signOut, GoogleUser } from './services/googleAuthService';
import { GoogleDriveDataProvider } from './context/GoogleDriveDataContext';
import { AppController } from './AppController';

const Root: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(user => {
            setCurrentUser(user);
            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        signOut();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                {/* Initial auth check loading spinner can go here */}
            </div>
        );
    }

    if (currentUser) {
        return (
            <GoogleDriveDataProvider>
                <AppController userEmail={currentUser.email} onLogout={handleLogout} />
            </GoogleDriveDataProvider>
        );
    } else {
        return <Auth />;
    }
};

export default Root;
