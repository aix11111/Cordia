// 基础API服务设置
const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:5000/api';

// 带认证的请求函数
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  // 在这里我们将从Supabase获取会话，并将JWT作为Bearer token添加到请求中
  // 例如：
  // const { data: { session } } = await supabase.auth.getSession();
  // const token = session?.access_token;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  };
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...defaultOptions,
    ...options,
  });
  
  // 如果响应不成功，抛出错误
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `请求失败: ${res.status}`);
  }
  
  // 对于204状态码（无内容），返回null
  if (res.status === 204) {
    return null;
  }
  
  // 其他情况返回JSON数据
  return res.json();
}
