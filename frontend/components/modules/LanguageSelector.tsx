/**
 * 贸语通译桥 - 语言选择器组件
 */
import React, { useEffect, useState } from 'react';
import Select from '../common/Select';
import { TranslationService, Language } from '@/services/translationService';

interface LanguageSelectorProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  includeAuto?: boolean;
  className?: string;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  includeAuto = false,
  className = '',
  disabled = false,
}) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 获取支持的语言列表
    const fetchLanguages = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const languageList = await TranslationService.getSupportedLanguages();
        
        // 如果不包含自动检测选项，则过滤掉它
        const filteredLanguages = includeAuto 
          ? languageList 
          : languageList.filter(lang => lang.code !== 'auto');
          
        setLanguages(filteredLanguages);
      } catch (error) {
        console.error('获取语言列表失败:', error);
        setError('无法加载语言列表');
        
        // 设置默认语言选项，以防API调用失败
        setLanguages([
          ...(includeAuto ? [{ code: 'auto', name: '自动检测' }] : []),
          { code: 'zh', name: '中文' },
          { code: 'en', name: '英文' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, [includeAuto]);

  // 将语言列表转换为Select组件所需的options格式
  const options = languages.map(lang => ({
    value: lang.code,
    label: lang.name
  }));

  return (
    <div className={className}>
      {error && <p className="text-red-500 text-sm mb-1">{error}</p>}
      <Select
        id={id}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        options={options}
        required
        disabled={disabled || isLoading}
      />
    </div>
  );
};

export default LanguageSelector;
