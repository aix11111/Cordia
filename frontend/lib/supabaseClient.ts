import { createClient } from '@supabase/supabase-js';

// 注意：这些环境变量将在实际部署时通过.env.local文件配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 创建Supabase客户端实例
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
