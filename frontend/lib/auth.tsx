'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from './supabaseClient';
import { getBackendToken, validateBackendToken, testAuth } from '@/services/authService';

// 认证上下文类型
type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  backendAuthenticated: boolean;
  backendToken: string | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null };
  }>;
  signOut: () => Promise<void>;
  refreshBackendToken: () => Promise<string | null>;
};

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件属性
interface AuthProviderProps {
  children: ReactNode;
}

// 认证提供者组件
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendAuthenticated, setBackendAuthenticated] = useState<boolean>(false);
  const [backendToken, setBackendToken] = useState<string | null>(null);

  // 获取后端令牌并验证
  const fetchBackendToken = async (supabaseSession: Session | null) => {
    if (!supabaseSession) {
      setBackendAuthenticated(false);
      setBackendToken(null);
      localStorage.removeItem('backend_token');
      return null;
    }

    try {
      // 检查localStorage中是否有保存的后端令牌
      const savedToken = localStorage.getItem('backend_token');
      
      if (savedToken) {
        // 验证保存的令牌是否有效
        const { valid } = await validateBackendToken(savedToken);
        
        if (valid) {
          setBackendToken(savedToken);
          setBackendAuthenticated(true);
          return savedToken;
        }
      }
      
      // 如果没有保存的令牌或令牌无效，获取新令牌
      const token = await getBackendToken(supabaseSession.access_token);
      
      if (token) {
        localStorage.setItem('backend_token', token);
        setBackendToken(token);
        setBackendAuthenticated(true);
        
        // 测试后端认证
        try {
          await testAuth(token);
        } catch (error) {
          console.error('后端认证测试失败:', error);
          setBackendAuthenticated(false);
        }
        
        return token;
      }
      
      setBackendAuthenticated(false);
      return null;
    } catch (error) {
      console.error('获取后端令牌出错:', error);
      setBackendAuthenticated(false);
      return null;
    }
  };

  // 刷新后端令牌
  const refreshBackendToken = async () => {
    if (session) {
      return await fetchBackendToken(session);
    }
    return null;
  };

  useEffect(() => {
    // 获取当前会话
    const getSession = async () => {
      setIsLoading(true);
      try {
        // 获取当前会话
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // 如果有会话，获取后端令牌
        if (data.session) {
          await fetchBackendToken(data.session);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // 监听认证状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // 在认证状态变化时更新后端令牌
      if (event === 'SIGNED_IN' && session) {
        await fetchBackendToken(session);
      } else if (event === 'SIGNED_OUT') {
        setBackendAuthenticated(false);
        setBackendToken(null);
        localStorage.removeItem('backend_token');
      }
      
      setIsLoading(false);
    });

    // 清理监听器
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 登录方法
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      return { data: data.session, error };
    } catch (error) {
      console.error('Error signing in:', error);
      return { data: null, error: error as Error };
    }
  };

  // 注册方法
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      
      return { data, error };
    } catch (error) {
      console.error('Error signing up:', error);
      return { 
        data: { user: null, session: null }, 
        error: error as Error 
      };
    }
  };

  // 登出方法
  const signOut = async () => {
    try {
      // 清除后端令牌
      setBackendAuthenticated(false);
      setBackendToken(null);
      localStorage.removeItem('backend_token');
      
      // 登出Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    backendAuthenticated,
    backendToken,
    signIn,
    signUp,
    signOut,
    refreshBackendToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义钩子，用于在组件中访问认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
