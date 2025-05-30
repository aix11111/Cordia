# 贸语通译桥 - 后端

## 项目概述

贸语通译桥是一个AI驱动的在线服务平台，旨在帮助中小企业克服跨境贸易中的语言障碍、专业知识不足和合规风险等问题。本仓库包含平台的后端部分，使用Python (Django/Flask) 开发。

## 核心功能

1. **智能机器翻译服务**：管理专业领域术语库和翻译API
2. **标准化模板库**：存储和处理合同和通信文件模板
3. **即时知识问答系统**：管理FAQ数据库和检索算法

## 技术栈

- Python 3.x
- Django/Flask 框架
- Supabase 用于身份验证和数据存储
- AI/NLP工具: NLTK, spaCy, TensorFlow/PyTorch
- 第三方翻译API集成: DeepL, Google Translate

## 目录结构

```
backend/
├── app_project/           # Django项目目录 / Flask应用根目录
├── core/                  # 核心应用 (Django应用或Flask蓝图)
├── users/                 # 用户管理
├── translation_service/   # 翻译模块
├── template_service/      # 模板模块
├── qa_service/            # 问答模块
├── ai_integrations/       # AI模型和集成逻辑
├── data/                  # 数据存储，脚本
├── tests/                 # 后端测试
├── requirements.txt       # Python依赖
├── Dockerfile             # 容器化后端
└── .env.example           # 环境变量模板
```

## 安装与运行

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Unix/MacOS
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行开发服务器 (Django)
python manage.py runserver

# 或运行开发服务器 (Flask)
flask run
```

## 环境变量

创建一个`.env`文件，包含以下变量：

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
DATABASE_URL=your_database_url
DEEPL_API_KEY=your_deepl_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key
SECRET_KEY=your_django_or_flask_secret_key
DEBUG=True  # 仅用于开发环境
```

## API文档

API文档将使用OpenAPI/Swagger格式提供，可通过以下方式访问：

- Django: `/api/docs/`
- Flask: `/api/docs/`

## 开发规范

- 遵循PEP 8编码规范
- 编写单元测试
- 使用类型注解
- 使用清晰的文档字符串
