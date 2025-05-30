"""
贸语通译桥 - 核心模块路由
"""
from flask import Blueprint, jsonify

# 创建蓝图
core_bp = Blueprint('core', __name__)

@core_bp.route('/')
def index():
    """API根端点"""
    return jsonify({
        'service': '贸语通译桥API',
        'version': '0.1.0',
        'status': 'active'
    })
