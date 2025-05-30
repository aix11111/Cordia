/**
 * 贸语通译桥 - 模板服务
 * 
 * 处理翻译模板相关功能
 */

import { ApiService } from './apiService';

/**
 * 模板接口
 */
export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 模板服务类
 */
export class TemplateService {
  /**
   * 获取所有模板列表
   * 
   * @returns 模板列表
   */
  static async getTemplates(): Promise<Template[]> {
    return ApiService.get<Template[]>('/templates');
  }
  
  /**
   * 获取单个模板详情
   * 
   * @param id 模板ID
   * @returns 模板详情
   */
  static async getTemplateById(id: string): Promise<Template> {
    return ApiService.get<Template>(`/templates/${id}`);
  }
  
  /**
   * 根据分类筛选模板
   * 
   * @param category 分类名称
   * @returns 模板列表
   */
  static async getTemplatesByCategory(category: string): Promise<Template[]> {
    return ApiService.get<Template[]>('/templates', {
      params: { category }
    });
  }
}
