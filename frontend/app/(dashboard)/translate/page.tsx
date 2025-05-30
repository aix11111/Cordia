'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TranslationInput from '@/components/modules/TranslationInput';
import TranslationResult from '@/components/modules/TranslationResult';
import { TranslationService, TranslationRequest, TranslationResponse } from '@/services/translationService';
import { useAuth } from '@/lib/auth';

export default function TranslatePage() {
  const { backendAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);

  const handleTranslate = async (text: string, sourceLanguage: string, targetLanguage: string) => {
    // 重置状态
    setError(null);
    setIsLoading(true);

    try {
      // 检查认证状态
      if (!backendAuthenticated) {
        throw new Error('请先登录以使用翻译功能');
      }

      // 调用翻译服务
      const response = await TranslationService.translateText({
        text,
        sourceLanguage,
        targetLanguage
      });

      // 更新结果
      setTranslationResult(response);
    } catch (err) {
      console.error('翻译出错:', err);
      setError(err instanceof Error ? err.message : '翻译过程中出现错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">文本翻译</h1>
          <Link href="/dashboard/translate/history" className="text-blue-600 hover:text-blue-800 flex items-center">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              翻译历史
            </span>
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <TranslationInput 
          onTranslate={handleTranslate}
          isLoading={isLoading}
        />
        
        {translationResult && (
          <TranslationResult
            translatedText={translationResult.translatedText}
            originalText={translationResult.originalText}
            sourceLanguage={translationResult.sourceLanguage}
            targetLanguage={translationResult.targetLanguage}
            detectedLanguage={translationResult.detectedLanguage}
            timestamp={translationResult.timestamp}
          />
        )}
      </div>
    </div>
  );
}
