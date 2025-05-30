"""
贸语通译桥 - Flask应用工厂
"""
from flask import Flask
from flask_cors import CORS

from app_project.config import get_config

def create_app():
    """创建并配置Flask应用实例"""
    app = Flask(__name__)
    
    # 加载配置
    config = get_config()
    app.config.from_object(config)
    
    # 配置CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    
    # 注册蓝图
    register_blueprints(app)
    
    # 添加健康检查端点
    @app.route('/api/health')
    def health_check():
        """健康检查端点"""
        return {'status': 'ok', 'service': '贸语通译桥API'}
    
    return app

def register_blueprints(app):
    """注册蓝图"""
    from core.routes import core_bp
    from users.routes import users_bp
    from users.auth_routes import auth_bp
    from translation_service.routes import translation_bp
    from template_service.routes import template_bp
    from qa_service.routes import qa_bp
    
    # 注册蓝图
    app.register_blueprint(core_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(translation_bp, url_prefix='/api/translation')
    app.register_blueprint(template_bp, url_prefix='/api/templates')
    app.register_blueprint(qa_bp, url_prefix='/api/qa')
