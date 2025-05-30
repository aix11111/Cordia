'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // 保护路由 - 如果用户未登录，重定向到登录页面
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 处理注销
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('登出错误:', error);
    }
  };
  
  // 如果正在加载或用户未登录，显示加载中
  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent">
          </div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 侧边栏 */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className={`${isSidebarOpen ? 'block' : 'hidden'}`}>
            <h2 className="text-xl font-bold">贸语通译桥</h2>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:text-gray-300"
          >
            {isSidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3">🏠</span>
                {isSidebarOpen && <span>首页</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/translate"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3">🔄</span>
                {isSidebarOpen && <span>翻译</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/templates"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3">📄</span>
                {isSidebarOpen && <span>模板</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/qa"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3">❓</span>
                {isSidebarOpen && <span>问答</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-700 rounded-md"
              >
                <span className="mr-3">⚙️</span>
                {isSidebarOpen && <span>设置</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 头部 */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold">控制面板</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="flex items-center focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    👤
                  </div>
                  <span className="ml-2">{user?.email || '用户'}</span>
                </button>
                {/* 下拉菜单在这里 */}
              </div>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={handleSignOut}
              >
                登出
              </button>
            </div>
          </div>
        </header>

        {/* 内容区 */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
