import React, { createContext, useContext, useState, useEffect, ReactNode } from
'react';
import {
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, deleteDoc, runTransaction } from
'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User, UserRole, generateNickname, CAMPUS_CODE, FACULTY_CODE } from
'@/types';

  interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isLoading: boolean;
    isAuthReady: boolean;
    login: (role: UserRole, campusCode: string, adminEmail?: string, adminPassword?:
  string, customNickname?: string) => Promise<{ success: boolean; error?: string }>;
    loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    checkNicknameAvailable: (nickname: string) => Promise<boolean>;
  }

  const AuthContext = createContext<AuthContextType | undefined>(undefined);

  export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthReady, setIsAuthReady] = useState(false);

    const checkNicknameAvailable = async (nickname: string): Promise<boolean> => {
      try {
        const normalizedNickname = nickname.toLowerCase().trim();
        const usernameDoc = await getDoc(doc(db, 'usernames', normalizedNickname));
        return !usernameDoc.exists();
      } catch (error: any) {
        console.error('Error checking nickname:', error);
        if (error?.code === 'permission-denied') return true;
        return true;
      }
    };

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);

        if (fbUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              const appUser: User = {
                id: fbUser.uid,
                email: userData.email || undefined,
                role: userData.role === 'faculty' ? 'admin' : 'student',
                nickname: userData.username || userData.name,
                createdAt: userData.createdAt?.toDate() || new Date(),
              };
              setUser(appUser);
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }

        setIsAuthReady(true);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }, []);

    const login = async (
      role: UserRole,
      campusCode: string,
      adminEmail?: string,
      adminPassword?: string,
      customNickname?: string
    ): Promise<{ success: boolean; error?: string }> => {
      if (role === 'student' && campusCode !== CAMPUS_CODE) {
        return { success: false, error: 'Invalid campus code' };
      }

      if (role === 'admin' && campusCode !== FACULTY_CODE) {
        return { success: false, error: 'Invalid faculty code' };
      }

      if (role === 'admin') {
        if (!adminEmail || !adminPassword) {
          return { success: false, error: 'Email and password are required' };
        }

        try {
          const userCredential = await signInWithEmailAndPassword(auth, adminEmail,
  adminPassword);
          const fbUser = userCredential.user;

          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (!userDoc.exists() || userDoc.data().role !== 'faculty') {
            await signOut(auth);
            return { success: false, error: 'Access denied. This account does not have
  admin privileges.' };
          }

          return { success: true };
        } catch (error: any) {
          if (
            error.code === 'auth/invalid-credential' ||
            error.code === 'auth/user-not-found' ||
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/invalid-email'
          ) {
            return { success: false, error: 'Invalid email or password' };
          }
          return { success: false, error: 'Login failed. Please try again.' };
        }
      }

      const nickname = customNickname?.trim() || generateNickname();
      const normalizedNickname = nickname.toLowerCase();

      try {
        const userCredential = await signInAnonymously(auth);
        const fbUser = userCredential.user;
        const usernameRef = doc(db, 'usernames', normalizedNickname);

        try {
          await runTransaction(db, async (transaction) => {
            const usernameDoc = await transaction.get(usernameRef);
            if (usernameDoc.exists()) throw new Error('Username taken');

            transaction.set(usernameRef, { uid: fbUser.uid, createdAt:
  serverTimestamp() });
            transaction.set(doc(db, 'users', fbUser.uid), {
              uid: fbUser.uid,
              username: nickname,
              role: 'student',
              campusCode: campusCode,
              anonymous: true,
              upvoteCount: 0,
              downvoteCount: 0,
              issueCount: 0,
              commentCount: 0,
              createdAt: serverTimestamp(),
            });
          });

          setUser({ id: fbUser.uid, role: 'student', nickname, createdAt: new Date()
  });
          return { success: true };
        } catch (transactionError: any) {
          await signOut(auth);
          if (transactionError.message === 'Username taken') {
            return { success: false, error: 'This username is already taken. Please
  choose another.' };
          }
          return { success: false, error: 'Failed to create account. Please try again.'
   };
        }
      } catch (error: any) {
        return { success: false, error: error.message || 'Login failed. Please try
  again.' };
      }
    };

    const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> =>
  {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const fbUser = result.user;
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));

        if (!userDoc.exists()) {
          const nickname = generateNickname();
          const normalizedNickname = nickname.toLowerCase();

          try {
            await runTransaction(db, async (transaction) => {
              const usernameRef = doc(db, 'usernames', normalizedNickname);
              const usernameDoc = await transaction.get(usernameRef);
              const finalNickname = usernameDoc.exists()
                ? `${nickname}_${fbUser.uid.slice(0, 4)}`
                : nickname;

              transaction.set(
                doc(db, 'usernames', usernameDoc.exists() ? finalNickname.toLowerCase()
   : normalizedNickname),
                { uid: fbUser.uid, createdAt: serverTimestamp() }
              );
              transaction.set(doc(db, 'users', fbUser.uid), {
                uid: fbUser.uid,
                username: finalNickname,
                email: fbUser.email,
                role: 'student',
                anonymous: false,
                upvoteCount: 0,
                downvoteCount: 0,
                issueCount: 0,
                commentCount: 0,
                createdAt: serverTimestamp(),
              });
            });
          } catch {
            await signOut(auth);
            return { success: false, error: 'Failed to create account. Please try
  again.' };
          }
        }

        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message || 'Google sign-in failed' };
      }
    };

    const logout = async () => {
      const currentUser = firebaseUser;
      const currentAppUser = user;

      try {
        if (currentUser && currentAppUser?.role === 'student') {
          if (currentAppUser.nickname) {
            try { await deleteDoc(doc(db, 'usernames',
  currentAppUser.nickname.toLowerCase())); }
            catch (e) { console.error('Error deleting username:', e); }
          }
          try { await deleteDoc(doc(db, 'users', currentUser.uid)); }
          catch (e) { console.error('Error deleting user doc:', e); }
        }
        await signOut(auth);
      } catch (error) {
        console.error('Sign out error:', error);
      }

      setUser(null);
      setFirebaseUser(null);
    };

    return (
      <AuthContext.Provider value={{
        user, firebaseUser, isLoading, isAuthReady,
        login, loginWithGoogle, logout,
        isAuthenticated: !!user && !!firebaseUser,
        checkNicknameAvailable
      }}>
        {children}
      </AuthContext.Provider>
    );
  }

  export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an
  AuthProvider');
    return context;
  }