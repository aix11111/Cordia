"""
贸语通译桥 - 数据库连接模块
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import os

# 从环境变量获取数据库URI，如果没有设置则使用SQLite
DATABASE_URI = os.getenv('DATABASE_URI', 'sqlite:///translation_service.db')

# 创建引擎
engine = create_engine(DATABASE_URI, convert_unicode=True)

# 创建会话
db_session = scoped_session(
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
)

# 声明基类
Base = declarative_base()
Base.query = db_session.query_property()

# 数据库会话
db = db_session

def init_db():
    """初始化数据库
    
    创建所有模型定义的表
    """
    # 导入所有包含模型的模块，确保它们在调用init_db()之前被装载
    import translation_service.models
    Base.metadata.create_all(bind=engine)
