/**
 * 贸语通译桥 - 认证服务
 * 
 * 处理前端与后端API的认证交互
 */

import { supabase } from '@/lib/supabaseClient';

// 后端API URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

/**
 * 从后端获取JWT令牌
 * 
 * @param supabaseToken Supabase访问令牌
 * @returns 后端JWT令牌
 */
export async function getBackendToken(supabaseToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ supabase_token: supabaseToken })
    });

    if (!response.ok) {
      throw new Error(`获取后端令牌失败: ${response.status}`);
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('获取后端令牌时出错:', error);
    return null;
  }
}

/**
 * 验证后端令牌是否有效
 * 
 * @param token 后端JWT令牌
 * @returns 验证结果和用户数据
 */
export async function validateBackendToken(token: string): Promise<{ valid: boolean; user?: any }> {
  try {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token })
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return { valid: true, user: data.user };
  } catch (error) {
    console.error('验证后端令牌时出错:', error);
    return { valid: false };
  }
}

/**
 * 使用令牌调用API
 * 
 * @param endpoint API端点
 * @param options 请求选项
 * @param token JWT令牌
 * @returns 响应数据
 */
export async function callApi(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<any> {
  try {
    // 如果没有提供token，尝试从本地存储获取
    const authToken = token || localStorage.getItem('backend_token');
    
    if (!authToken) {
      throw new Error('缺少认证令牌');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      ...options.headers
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: `HTTP错误 ${response.status}` }));
      throw new Error(error.error || `HTTP错误 ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API调用失败 (${endpoint}):`, error);
    throw error;
  }
}

/**
 * 测试认证
 * 
 * 调用认证测试端点来验证令牌是否有效
 */
export async function testAuth(token: string): Promise<any> {
  try {
    return await callApi('/users/auth-test', { method: 'GET' }, token);
  } catch (error) {
    console.error('认证测试失败:', error);
    throw error;
  }
}
