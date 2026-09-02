'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'email' | 'google';
  createdAt: string;
  isVip?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
            error_callback?: (err: unknown) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'jyut_user_session_v1';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '658125666643-6k2cu0ujd9rqqffrcvl2mujqqnkmd94h.apps.googleusercontent.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load GIS script dynamically on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('google-gis-sdk')) {
      const script = document.createElement('script');
      script.id = 'google-gis-sdk';
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Load user from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore JSON parse or storage access errors
    } finally {
      setLoading(false);
    }
  }, []);

  // Broadcast session to extension
  const syncToExtension = (u: User | null) => {
    if (typeof window === 'undefined') return;
    try {
      window.dispatchEvent(new CustomEvent('jyut_auth_sync', { detail: u }));
      window.postMessage({ type: 'JYUT_AUTH_SYNC', user: u }, '*');
    } catch {
      // ignore
    }
  };

  // Listen for handshake from Jyutping Extension
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'JYUT_REQUEST_AUTH') {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          const currentUser = stored ? JSON.parse(stored) : null;
          syncToExtension(currentUser);
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Save or remove user session
  const persistUser = (u: User | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      syncToExtension(u);
    } catch {
      // ignore
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!email.includes('@') || pass.length < 6) {
        return { success: false, error: '請輸入有效的電子郵件與至少 6 位密碼' };
      }

      const defaultName = email.split('@')[0];
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name: defaultName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isVip: true,
      };

      persistUser(newUser);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '登入發生異常';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));

      if (!email.includes('@') || pass.length < 6) {
        return { success: false, error: '電子郵件格式不正確或密碼長度不足 6 位' };
      }

      const defaultName = email.split('@')[0];
      const newUser: User = {
        id: `usr_${Date.now()}`,
        email,
        name: defaultName,
        provider: 'email',
        createdAt: new Date().toISOString(),
        isVip: true,
      };

      persistUser(newUser);
      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '註冊發生異常';
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = (): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    return new Promise((resolve) => {
      // Check if Google GIS SDK is loaded
      if (typeof window === 'undefined' || !window.google?.accounts?.oauth2) {
        setLoading(false);
        resolve({
          success: false,
          error: 'Google 登入服務加載中或網絡無法連接 Google，請檢查代理網絡或稍後重試',
        });
        return;
      }

      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid email profile',
          callback: async (response) => {
            if (response.error) {
              setLoading(false);
              resolve({ success: false, error: `Google 授權失敗: ${response.error}` });
              return;
            }

            if (!response.access_token) {
              setLoading(false);
              resolve({ success: false, error: '未能獲取有效授權 Token' });
              return;
            }

            try {
              // Fetch user profile from Google UserInfo API
              const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                  Authorization: `Bearer ${response.access_token}`,
                },
              });

              if (!res.ok) {
                throw new Error('獲取 Google 用戶資料失敗');
              }

              const profile = await res.json();
              const googleUser: User = {
                id: profile.sub || `g_${Date.now()}`,
                email: profile.email || '',
                name: profile.name || profile.email?.split('@')[0] || 'Google 學員',
                avatar: profile.picture || undefined,
                provider: 'google',
                createdAt: new Date().toISOString(),
                isVip: true,
              };

              persistUser(googleUser);
              setLoading(false);
              resolve({ success: true });
            } catch (fetchErr: unknown) {
              setLoading(false);
              const errMsg = fetchErr instanceof Error ? fetchErr.message : '解析用戶信息失敗';
              resolve({ success: false, error: errMsg });
            }
          },
          error_callback: (err) => {
            setLoading(false);
            resolve({ success: false, error: 'Google 授權窗口已被關閉或阻止' });
          },
        });

        // Trigger Google official Sign-In popup
        client.requestAccessToken({ prompt: 'select_account' });
      } catch (err: unknown) {
        setLoading(false);
        const message = err instanceof Error ? err.message : '初始化 Google 登入失敗';
        resolve({ success: false, error: message });
      }
    });
  };

  const logout = () => {
    persistUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
