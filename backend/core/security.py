"""
贸语通译桥 - 安全模块
处理认证、授权和数据加密
"""
import os
import json
from functools import wraps
from flask import request, jsonify, current_app
import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
import requests
from typing import Callable, Dict, Any, Optional

def get_supabase_config() -> Dict[str, str]:
    """获取Supabase配置"""
    return {
        'url': current_app.config.get('SUPABASE_URL', ''),
        'key': current_app.config.get('SUPABASE_SERVICE_KEY', '')
    }

def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """
    验证Supabase JWT令牌
    
    Args:
        token: 待验证的JWT令牌
    
    Returns:
        如果令牌有效，返回用户信息字典；否则返回None
    """
    try:
        # 在实际实现中，我们会使用Supabase提供的公钥验证令牌
        # 这里简化处理，直接调用Supabase API验证令牌
        
        supabase_config = get_supabase_config()
        
        if not supabase_config['url'] or not supabase_config['key']:
            current_app.logger.error("缺少Supabase配置")
            return None
        
        # 例如使用Supabase Admin API验证令牌，或者本地使用JWT库和Supabase的JWKS验证
        
        # 模拟验证成功
        # 在实际实现中，应该解析JWT并验证签名
        payload = {
            'sub': 'user-id',
            'email': 'user@example.com',
            'role': 'authenticated'
        }
        
        return payload
    except (InvalidTokenError, ExpiredSignatureError) as e:
        current_app.logger.error(f"令牌验证失败: {str(e)}")
        return None
    except Exception as e:
        current_app.logger.error(f"令牌验证过程中出错: {str(e)}")
        return None

def generate_token(user_id, email, role='user', expiration=24):
    """生成JWT令牌
    
    Args:
        user_id: 用户ID
        email: 用户电子邮箱
        role: 用户角色 (默认: 'user')
        expiration: 过期时间，单位为小时 (默认: 24小时)
    
    Returns:
        生成的JWT令牌
    """
    payload = {
        'sub': user_id,
        'email': email,
        'role': role,
        'iat': datetime.datetime.utcnow(),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=expiration)
    }
    
    return jwt.encode(
        payload,
        current_app.config.get('SECRET_KEY', os.urandom(24)),
        algorithm='HS256'
    )

def auth_required(f):
    """认证要求装饰器
    
    检查是否存在有效的JWT令牌
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # 从请求头中获取令牌
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]
            except IndexError:
                return jsonify({'error': '无效的认证头'}), 401
        
        if not token:
            return jsonify({'error': '缺少认证令牌'}), 401
        
        try:
            # 解码令牌
            payload = jwt.decode(
                token,
                current_app.config.get('SECRET_KEY', os.urandom(24)),
                algorithms=['HS256']
            )
            
            # 将用户信息附加到请求对象
            request.user = payload
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '无效的令牌'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

def role_required(required_role):
    """角色要求装饰器
    
    检查用户是否具有指定角色
    
    Args:
        required_role: 需要的角色名称
    """
    def decorator(f):
        @wraps(f)
        @auth_required
        def decorated_function(*args, **kwargs):
            # 用户信息在auth_required中已经添加到请求对象
            user = getattr(request, 'user', {})
            user_role = user.get('role', '')
            
            if not user_role or user_role != required_role:
                return jsonify({'error': '无权访问此资源'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    """管理员要求装饰器
    
    检查用户是否为管理员
    """
    return role_required('admin')(f)

def hash_password(password, salt=None):
    """哈希密码
    
    Args:
        password: 原始密码
        salt: 可选的盐值，如果不提供则生成新的
    
    Returns:
        (hashed_password, salt): 哈希后的密码和盐值
    """
    if not salt:
        salt = secrets.token_hex(16)
    
    # 使用SHA-256哈希算法
    pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), 
                                  salt.encode('utf-8'), 100000)
    pwdhash = pwdhash.hex()
    
    return pwdhash, salt

def verify_password(stored_password, salt, provided_password):
    """验证密码
    
    Args:
        stored_password: 存储的哈希密码
        salt: 存储的盐值
        provided_password: 用户提供的密码
    
    Returns:
        bool: 如果密码匹配则为True，否则为False
    """
    pwdhash, _ = hash_password(provided_password, salt)
    return pwdhash == stored_password

def validate_token(token):
    """验证JWT令牌
    
    Args:
        token: JWT令牌
    
    Returns:
        (is_valid, payload): 令牌是否有效及其有效负载
    """
    try:
        # 解码令牌
        payload = jwt.decode(
            token,
            current_app.config.get('SECRET_KEY', os.urandom(24)),
            algorithms=['HS256']
        )
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, {'error': '令牌已过期'}
    except jwt.InvalidTokenError:
        return False, {'error': '无效的令牌'}

def encrypt_sensitive_data(data: str) -> str:
    """
    加密敏感数据
    
    在实际实现中，应使用适当的加密算法，如AES
    这里提供一个简单示例
    """
    # 这只是一个占位示例，实际应用应使用安全的加密库
    return f"ENCRYPTED({data})"

def decrypt_sensitive_data(encrypted_data: str) -> str:
    """
    解密敏感数据
    
    在实际实现中，应使用对应的解密算法
    这里提供一个简单示例
    """
    # 这只是一个占位示例，实际应用应使用安全的解密库
    if encrypted_data.startswith("ENCRYPTED(") and encrypted_data.endswith(")"):
        return encrypted_data[10:-1]
    return encrypted_data
