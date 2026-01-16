import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/types';
import { authApi, setAuthToken, getAuthToken } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        // Verify token with backend
        const { data, error } = await authApi.getMe();
        if (data && !error) {
          setUser({
            id: data.id,
            email: data.email,
            name: data.name,
            created_at: data.created_at,
          });
        } else {
          // Token invalid, clear it
          setAuthToken(null);
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await authApi.login(email, password);
      
      if (error || !data) {
        return { error: new Error(error || 'Login failed') };
      }

      // Store token for future requests
      setAuthToken(data.access_token);

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        created_at: data.user.created_at,
      };

      setUser(userData);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<{ error: Error | null }> => {
    try {
      const { data, error } = await authApi.register(name, email, password);
      
      if (error || !data) {
        return { error: new Error(error || 'Registration failed') };
      }

      // Store token for future requests
      setAuthToken(data.access_token);

      const userData: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        created_at: data.user.created_at,
      };

      setUser(userData);
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
