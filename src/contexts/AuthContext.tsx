'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          ...data,
          uid,
          subscriptionEndDate: data.subscriptionEndDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
        } as User);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
        // Set session cookie
        const token = await firebaseUser.getIdToken();
        await fetch('/api/auth/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
      } else {
        setUserData(null);
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const { user: gUser } = result;
    
    // Create user doc if doesn't exist
    const userDocRef = doc(db, 'users', gUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: gUser.uid,
        fullName: gUser.displayName || '',
        businessName: '',
        email: gUser.email || '',
        phone: '',
        language: 'sq',
        subscriptionStatus: 'inactive',
        savedTenders: [],
        notificationCategories: [],
        createdAt: serverTimestamp(),
      });
    }
  };

  const register = async ({ email, password, fullName, businessName, phone }: RegisterData) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const { user: newUser } = result;

    // Create Firestore user document
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      fullName,
      businessName,
      email,
      phone: phone || '',
      language: 'sq',
      subscriptionStatus: 'inactive',
      savedTenders: [],
      notificationCategories: [],
      createdAt: serverTimestamp(),
    });

    // Send email verification
    await sendEmailVerification(newUser);

    // Send welcome email via API
    await fetch('/api/emails/welcome', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: fullName }),
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      resetPassword,
      refreshUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
