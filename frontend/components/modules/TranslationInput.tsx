import React, { useState } from 'react';
import Button from '../common/Button';
import LanguageSelector from './LanguageSelector';

interface TranslationInputProps {
  onTranslate: (text: string, sourceLanguage: string, targetLanguage: string) => Promise<void>;
  isLoading: boolean;
}

const TranslationInput: React.FC<TranslationInputProps> = ({ onTranslate, isLoading }) => {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('zh');
  const [targetLanguage, setTargetLanguage] = useState('en');

  // 清除文本输入
  const handleClearText = () => {
    setText('');
  };
  
  // 交换源语言和目标语言
  const handleSwapLanguages = () => {
    // 不允许交换到自动检测
    if (targetLanguage === 'auto') {
      return;
    }
    
    const temp = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onTranslate(text, sourceLanguage, targetLanguage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex space-x-4">
        <LanguageSelector
          id="sourceLanguage"
          name="sourceLanguage"
          label="源语言"
          value={sourceLanguage}
          onChange={(e) => setSourceLanguage(e.target.value)}
          includeAuto={true}
          className="w-1/2"
        />
        
        <div className="flex items-center justify-center mt-6 mx-2">
          <button 
            type="button" 
            onClick={handleSwapLanguages}
            className="p-2 rounded-full hover:bg-gray-100"
            title="交换语言"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>
        
        <LanguageSelector
          id="targetLanguage"
          name="targetLanguage"
          label="目标语言"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="w-1/2"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700">
            待翻译文本 <span className="text-red-500">*</span>
          </label>
          <button 
            type="button" 
            onClick={handleClearText}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            清除
          </button>
        </div>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入需要翻译的文本内容..."
          required
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {text.length} 字符
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          onClick={handleClearText}
          disabled={isLoading || !text.trim()}
          variant="outline"
        >
          重置
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !text.trim()}
          variant="primary"
        >
          {isLoading ? '翻译中...' : '翻译'}
        </Button>
      </div>
    </form>
  );
};

export default TranslationInput;
