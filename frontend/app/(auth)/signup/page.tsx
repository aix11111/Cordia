'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function Signup() {
  const router = useRouter();
  const { signUp, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // 如果用户已登录，重定向到仪表板
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error, data } = await signUp(email, password, {
        full_name: fullName,
        company: company
      });
      
      if (error) {
        throw error;
      }
      
      // 注册成功
      setSuccess(true);
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 2000);
    } catch (err: any) {
      setError(err.message || '注册时出错，请稍后再试');
      console.error('注册错误:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">注册</h1>
          <p className="mt-2 text-gray-600">创建您的贸语通译桥账户</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              全名
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              公司名称
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              电子邮件
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">
              密码必须至少包含8个字符，包括一个大写字母、一个小写字母和一个数字
            </p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            已有账户?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
