/**
 * 贸语通译桥 - API服务
 * 
 * 基础API服务，处理与后端的通信
 */

// 后端API URL
declare const process: { env: { [key: string]: string } };
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * API请求选项类型
 */
export interface ApiRequestOptions extends RequestInit {
  authenticated?: boolean;
  params?: Record<string, string>;
}

/**
 * 基础API服务类
 */
export class ApiService {
  /**
   * 构建URL
   * 
   * @param endpoint API端点
   * @param params URL参数
   * @returns 完整的URL
   */
  static buildUrl(endpoint: string, params?: Record<string, string>): string {
    // 确保endpoint以/开头
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${API_URL}${normalizedEndpoint}`);
    
    // 添加查询参数
    if (params) {
      Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
      });
    }
    
    return url.toString();
  }
  
  /**
   * 发送API请求
   * 
   * @param endpoint API端点
   * @param options 请求选项
   * @returns 响应数据
   */
  static async request<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    const { authenticated = true, params, ...fetchOptions } = options;
    
    // 默认请求头
    let headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers
    };
    
    // 如果需要认证，添加令牌
    if (authenticated) {
      const token = localStorage.getItem('backend_token');
      if (token) {
        headers = {
          ...headers,
          'Authorization': `Bearer ${token}`
        };
      } else {
        throw new Error('需要认证，但未找到令牌');
      }
    }
    
    // 构建请求选项
    const requestOptions: RequestInit = {
      ...fetchOptions,
      headers
    };
    
    // 发送请求
    try {
      const response = await fetch(this.buildUrl(endpoint, params), requestOptions);
      
      // 处理错误响应
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP错误 ${response.status}`);
      }
      
      // 解析响应
      return await response.json() as T;
    } catch (error) {
      console.error(`API请求失败 (${endpoint}):`, error);
      throw error;
    }
  }
  
  /**
   * GET请求
   * 
   * @param endpoint API端点
   * @param options 请求选项
   * @returns 响应数据
   */
  static async get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }
  
  /**
   * POST请求
   * 
   * @param endpoint API端点
   * @param data 请求数据
   * @param options 请求选项
   * @returns 响应数据
   */
  static async post<T>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  /**
   * PUT请求
   * 
   * @param endpoint API端点
   * @param data 请求数据
   * @param options 请求选项
   * @returns 响应数据
   */
  static async put<T>(endpoint: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }
  
  /**
   * DELETE请求
   * 
   * @param endpoint API端点
   * @param options 请求选项
   * @returns 响应数据
   */
  static async delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}
