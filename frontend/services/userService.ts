/**
 * 贸语通译桥 - 用户服务
 * 
 * 处理用户资料和认证相关功能
 */

import { ApiService } from './apiService';

/**
 * 用户资料接口
 */
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  company?: string;
  preferred_languages?: string[];
}

/**
 * 用户资料更新数据接口
 */
export interface UserProfileUpdateData {
  full_name?: string;
  company?: string;
  preferred_languages?: string[];
}

/**
 * 用户服务类
 */
export class UserService {
  /**
   * 获取当前用户的资料
   * 
   * @returns 用户资料
   */
  static async getUserProfile(): Promise<UserProfile> {
    return ApiService.get<UserProfile>('/users/profile');
  }
  
  /**
   * 更新用户资料
   * 
   * @param data 要更新的用户资料数据
   * @returns 更新后的用户资料
   */
  static async updateUserProfile(data: UserProfileUpdateData): Promise<UserProfile> {
    return ApiService.put<UserProfile>('/users/profile', data);
  }
  
  /**
   * 验证认证状态
   * 
   * @returns 认证测试结果
   */
  static async testAuth(): Promise<{authenticated: boolean; user: any; message: string}> {
    return ApiService.get('/users/auth-test');
  }
}
