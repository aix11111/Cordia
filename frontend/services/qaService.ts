/**
 * 贸语通译桥 - 问答服务
 * 
 * 处理问答相关功能
 */

import { ApiService } from './apiService';

/**
 * FAQ项接口
 */
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 问答服务类
 */
export class QAService {
  /**
   * 获取所有FAQ列表
   * 
   * @returns FAQ列表
   */
  static async getFAQs(): Promise<FAQItem[]> {
    return ApiService.get<FAQItem[]>('/qa');
  }
  
  /**
   * 搜索FAQ
   * 
   * @param query 搜索关键词
   * @returns 匹配的FAQ列表
   */
  static async searchFAQs(query: string): Promise<FAQItem[]> {
    return ApiService.get<FAQItem[]>('/qa/search', {
      params: { query }
    });
  }
  
  /**
   * 按分类获取FAQ
   * 
   * @param category 分类名称
   * @returns 该分类下的FAQ列表
   */
  static async getFAQsByCategory(category: string): Promise<FAQItem[]> {
    return ApiService.get<FAQItem[]>('/qa', {
      params: { category }
    });
  }
}
