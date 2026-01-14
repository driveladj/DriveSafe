
"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userDetails: DocumentData | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    userDetails: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<DocumentData | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUser(user);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserDetails(docSnap.data());
                } else {
                    setUserDetails(null);
                }
            } else {
                setUser(null);
                setUserDetails(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userDetails }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
