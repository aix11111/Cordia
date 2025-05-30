/**
 * 贸语通译桥 - 翻译服务
 * 
 * 处理文本翻译相关功能
 */

import { ApiService } from './apiService';

/**
 * 翻译请求接口
 */
export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

/**
 * 翻译响应接口
 */
export interface TranslationResponse {
  translatedText: string;
  originalText: string;
  sourceLanguage: string;
  targetLanguage: string;
  detectedLanguage?: string;
  requestId?: string;
  timestamp?: string;
}

/**
 * 翻译历史记录接口
 */
export interface TranslationHistoryItem {
  id: string;
  user_id: string;
  original_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  detected_language?: string;
  created_at: string;
}

/**
 * 语言信息接口
 */
export interface Language {
  code: string;
  name: string;
}

/**
 * 翻译服务类
 */
export class TranslationService {
  /**
   * 翻译文本
   * 
   * @param params 翻译请求参数
   * @returns 翻译结果
   */
  static async translateText(params: TranslationRequest): Promise<TranslationResponse> {
    return ApiService.post<TranslationResponse>('/translation/translate', params);
  }
  
  /**
   * 获取支持的语言列表
   * 
   * @returns 支持的语言列表
   */
  static async getSupportedLanguages(): Promise<Language[]> {
    return ApiService.get<Language[]>('/translation/languages');
  }
  
  /**
   * 检测文本语言
   * 
   * @param text 要检测的文本
   * @returns 检测结果
   */
  static async detectLanguage(text: string): Promise<{text: string; detectedLanguage: string}> {
    return ApiService.post<{text: string; detectedLanguage: string}>('/translation/detect', { text });
  }
  
  /**
   * 获取翻译历史记录
   * 
   * @param limit 最大返回条数，默认为10
   * @returns 翻译历史记录列表
   */
  static async getTranslationHistory(limit: number = 10): Promise<TranslationHistoryItem[]> {
    return ApiService.get<TranslationHistoryItem[]>('/translation/history', {
      params: { limit: limit.toString() }
    });
  }
}
