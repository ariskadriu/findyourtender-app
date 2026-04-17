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
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    window.location.href = '/dashboard';
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

    // Explicitly sync session before redirecting
    const token = await gUser.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    // Send to dashboard and force refresh for server components
    window.location.href = '/dashboard';
  };

  const register = async ({ email, password, fullName, businessName, phone }: RegisterData) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const { user: newUser } = result;

      // Create Firestore user document (wrap in inner try as we want to log the exact failure)
      try {
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
      } catch (firestoreError) {
        console.error('Firestore Profile Creation Error:', firestoreError);
        // We don't throw here so the user can still be redirected to dashboard
      }

      // Send email verification
      try {
        await sendEmailVerification(newUser);
      } catch (e) { console.error('Email verification error:', e); }

      // Send welcome email via API
      try {
        await fetch('/api/emails/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: fullName }),
        });
      } catch (e) { console.error('Welcome email API error:', e); }

    } catch (authError) {
      console.error('Firebase Auth Registration Error:', authError);
      throw authError; // This is the fatal one we want to show in the UI
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const resetPassword = async (email: string) => {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Dështoi dërgimi i email-it.');
    }
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
