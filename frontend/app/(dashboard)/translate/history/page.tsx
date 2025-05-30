'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { TranslationService } from '@/services/translationService';
import Link from 'next/link';

interface TranslationHistoryItem {
  id: string;
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_language?: string;
  created_at: string;
}

export default function TranslationHistoryPage() {
  const { backendAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);

  useEffect(() => {
    const fetchTranslationHistory = async () => {
      if (!backendAuthenticated) {
        setError('请先登录以查看翻译历史');
        setIsLoading(false);
        return;
      }

      try {
        // 调用API获取翻译历史
        const historyData = await TranslationService.getTranslationHistory();
        setHistory(historyData);
      } catch (err) {
        console.error('获取翻译历史出错:', err);
        setError('获取翻译历史失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslationHistory();
  }, [backendAuthenticated]);

  // 获取语言名称的辅助函数
  const getLanguageLabel = (languageCode: string): string => {
    const languageMap: Record<string, string> = {
      zh: '中文',
      en: '英文',
      ja: '日文',
      ko: '韩文',
      fr: '法文',
      de: '德文',
      es: '西班牙文',
      ru: '俄文',
      auto: '自动检测'
    };
    
    return languageMap[languageCode] || languageCode;
  };

  // 截断文本的辅助函数
  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">翻译历史</h1>
          <Link href="/dashboard/translate" className="text-blue-600 hover:text-blue-800">
            <span>返回翻译</span>
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent"></div>
            <p className="ml-2">加载中...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-8 rounded text-center">
            <p className="text-lg mb-4">暂无翻译历史记录</p>
            <Link href="/dashboard/translate" className="text-blue-600 hover:text-blue-800">
              <span>开始翻译</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    时间
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    原文
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    译文
                  </th>
                  <th className="py-3 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    语言
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4 border-b border-gray-200 text-sm">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200 text-sm">
                      {truncateText(item.original_text)}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200 text-sm">
                      {truncateText(item.translated_text)}
                    </td>
                    <td className="py-4 px-4 border-b border-gray-200 text-sm">
                      {getLanguageLabel(item.source_language)} → {getLanguageLabel(item.target_language)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
