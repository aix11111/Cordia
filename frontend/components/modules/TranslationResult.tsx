import React, { useState, useEffect } from 'react';
import Button from '../common/Button';

interface TranslationResultProps {
  translatedText: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
  timestamp?: string;
}

const TranslationResult: React.FC<TranslationResultProps> = ({
  translatedText,
  originalText,
  sourceLanguage,
  targetLanguage,
  detectedLanguage,
  timestamp,
}) => {
  const [copied, setCopied] = useState(false);
  
  // 如果没有翻译结果，不显示组件
  if (!translatedText) {
    return null;
  }
  
  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      
      // 3秒后重置复制状态
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };
  
  // 朗读文本
  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      // 创建语音实例
      const utterance = new SpeechSynthesisUtterance(translatedText);
      
      // 根据目标语言设置语音语言
      utterance.lang = targetLanguage;
      
      // 开始朗读
      window.speechSynthesis.speak(utterance);
    } else {
      alert('您的浏览器不支持文本朗读功能');
    }
  };

  return (
    <div className="mt-8 border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-medium">
            翻译结果 ({getLanguageLabel(sourceLanguage)} → {getLanguageLabel(targetLanguage)})
          </h3>
          {detectedLanguage && sourceLanguage === 'auto' && (
            <p className="text-sm text-gray-500">
              检测到的语言: {getLanguageLabel(detectedLanguage)}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSpeak}
            title="朗读文本"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            title="复制到剪贴板"
          >
            {copied ? '已复制' : '复制'}
          </Button>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-md min-h-[200px] mb-2 whitespace-pre-wrap">
        {translatedText}
      </div>
      
      <div className="flex justify-between items-center text-xs text-gray-500">
        <div>
          {timestamp && (
            <span>翻译时间: {new Date(timestamp).toLocaleString()}</span>
          )}
        </div>
        <div>
          字符数: {translatedText.length}
        </div>
      </div>
    </div>
  );
};

// 获取语言名称的辅助函数
function getLanguageLabel(languageCode: string): string {
  const languageMap: Record<string, string> = {
    zh: '中文',
    en: '英文',
    ja: '日文',
    ko: '韩文',
    fr: '法文',
    de: '德文',
    es: '西班牙文',
    ru: '俄文',
  };
  
  return languageMap[languageCode] || languageCode;
}

export default TranslationResult;
