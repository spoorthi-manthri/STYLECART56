// Authentication state for the Java Spring Boot backend (no Supabase dependency).
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { loginUser, registerUser, type ApiUser } from '@/api/client';

interface AuthContextValue {
  session: { user: ApiUser } | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = 'stylecart_user';
const TOKEN_KEY = 'stylecart_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<{ user: ApiUser } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      if (saved) setSession({ user: JSON.parse(saved) as ApiUser });
    } catch {
      localStorage.removeItem(USER_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  async function signUp(name: string, email: string, password: string) {
    try {
      const result = await registerUser(name, email, password);
      const user = result.user ?? ({ id: '', email, name } as ApiUser);
      saveSession(user, result.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Registration failed. Check that the Java backend is running.' };
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const result = await loginUser(email, password);
      const user = result.user ?? ({ id: '', email } as ApiUser);
      saveSession(user, result.token);
      return { error: null };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Login failed. Check that the Java backend is running.' };
    }
  }

  function saveSession(user: ApiUser, token?: string) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    if (token) localStorage.setItem(TOKEN_KEY, token);
    setSession({ user });
  }

  async function signOut() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setSession(null);
  }

  return <AuthContext.Provider value={{ session, loading, signUp, signIn, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
