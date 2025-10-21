// --- MOCK Google Authentication Service ---
// This service simulates a Google authentication flow for demonstration purposes.
// In a real application, this would be replaced with the Google Identity Services library (GSI).

export interface GoogleUser {
  email: string;
  name: string;
  accessToken: string;
}

let currentUser: GoogleUser | null = null;
let authStateListener: ((user: GoogleUser | null) => void) | null = null;

const MOCK_USER: GoogleUser = {
  email: 'user@gmail.com',
  name: 'Demo User',
  accessToken: 'mock-access-token-for-google-drive-api',
};

// Simulates the sign-in process
export const signIn = (): Promise<GoogleUser> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = MOCK_USER;
      if (authStateListener) {
        authStateListener(currentUser);
      }
      resolve(currentUser);
    }, 1000); // Simulate network latency
  });
};

// Simulates the sign-out process
export const signOut = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null;
      if (authStateListener) {
        authStateListener(null);
      }
      resolve();
    }, 500);
  });
};

// Allows the application to listen for authentication changes (login/logout)
export const onAuthStateChanged = (callback: (user: GoogleUser | null) => void): (() => void) => {
  authStateListener = callback;
  // Immediately invoke with current state
  callback(currentUser); 
  
  // Return an unsubscribe function
  return () => {
    authStateListener = null;
  };
};

// Gets the current user's auth token
export const getAccessToken = (): string | null => {
    return currentUser?.accessToken ?? null;
}
