# 贸语通译桥 - 前端

## 项目概述

贸语通译桥是一个AI驱动的在线服务平台，旨在帮助中小企业克服跨境贸易中的语言障碍、专业知识不足和合规风险等问题。本仓库包含平台的前端部分，使用Next.js开发。

## 核心功能

1. **智能机器翻译服务**：利用专业领域术语库优化的翻译功能
2. **标准化模板库**：合同和通信文件模板，具备AI辅助填充功能
3. **即时知识问答系统**：基于FAQ的法律和商业咨询

## 技术栈

- Next.js 框架
- Supabase 用于身份验证和数据存储
- 组件库（待选）
- 状态管理（如Zustand、Jotai或Redux Toolkit）

## 目录结构

```
frontend/
├── app/                   # Next.js 13+ app router
│   ├── (auth)/            # 认证页面 (登录, 注册, 重置密码)
│   ├── (dashboard)/       # 登录后的受保护路由
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 着陆页
├── components/            # 可复用UI组件
│   ├── common/            # 通用组件 (按钮, 输入框, 模态框)
│   └── modules/           # 模块特定组件
├── services/              # 前端API客户端
├── store/                 # 状态管理
├── styles/                # 全局样式，主题
├── public/                # 静态资源 (图片, 字体)
├── lib/                   # 工具函数，Supabase客户端设置
├── next.config.js
├── tsconfig.json
└── package.json
```

## 安装与运行

```bash
# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 环境变量

创建一个`.env.local`文件，包含以下变量：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BACKEND_API_URL=your_backend_api_url
```

## 开发规范

- 使用TypeScript类型
- 遵循ESLint配置
- 组件使用函数式组件和Hooks
- 页面路由遵循Next.js的App Router约定
