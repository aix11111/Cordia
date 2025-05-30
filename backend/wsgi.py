"""
贸语通译桥 - WSGI入口文件
"""
from app_project.app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(app.config.get('PORT', 5000)))
