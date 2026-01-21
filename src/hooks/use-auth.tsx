
"use client";

import { createContext, useContext, ReactNode } from 'react';

// Mock types for compatibility
type User = object;
type DocumentData = { [key: string]: any };

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userDetails: DocumentData | null;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: false,
    userDetails: null,
    signOutUser: async () => {},
});

// A modified AuthProvider for the frontend-only version.
// It simulates a logged-out state.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const value = {
        user: null,
        loading: false,
        userDetails: null,
        signOutUser: async () => {
            console.log("Offline mode: signOutUser called.");
        },
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
