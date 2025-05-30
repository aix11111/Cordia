"""
贸语通译桥 - 翻译服务模块路由
"""
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from .services import TranslationService
from .models import TranslationRequest, TranslationHistoryRecord
from .db import db

translation_bp = Blueprint('translation', __name__, url_prefix='/translation')


@translation_bp.route('/translate', methods=['POST'])
@jwt_required()
def translate_text():
    """处理翻译请求"""
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # 验证请求数据
    if not data or 'text' not in data:
        return jsonify({'error': '请提供要翻译的文本'}), 400
    
    source_language = data.get('sourceLanguage', 'auto')
    target_language = data.get('targetLanguage', 'en')
    
    # 创建翻译请求
    translation_request = TranslationRequest(
        text=data['text'],
        source_language=source_language,
        target_language=target_language,
        user_id=user_id
    )
    
    # 执行翻译
    translation_response = TranslationService.translate_text(translation_request)
    
    # 保存翻译历史记录
    try:
        history_record = TranslationHistoryRecord(
            user_id=user_id,
            original_text=translation_response.original_text,
            translated_text=translation_response.translated_text,
            source_language=translation_response.source_language,
            target_language=translation_response.target_language,
            detected_language=translation_response.detected_language
        )
        db.session.add(history_record)
        db.session.commit()
        
        # 将记录ID添加到响应中
        translation_response.request_id = str(history_record.id)
    except Exception as e:
        # 记录错误但不阻止翻译响应
        print(f"保存翻译历史记录失败: {str(e)}")
    user = getattr(request, 'user', {})
    user_id = user.get('sub')
    
    if not user_id:
        return jsonify({'error': '无法获取用户ID'}), 400
    
    # 获取限制条数参数
    limit = request.args.get('limit', default=10, type=int)
    
    # 获取历史记录
    history = TranslationService.get_user_translation_history(user_id, limit)
    
    # 返回响应
    return jsonify([item.to_dict() for item in history])

@translation_bp.route('/detect', methods=['POST'])
@auth_required
def detect_language():
    """检测文本语言"""
    data = request.json
    
    # 获取请求参数
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': '请提供要检测的文本'}), 400
    
    # 检测语言
    detected_language = TranslationService.detect_language(text)
    
    # 返回响应
    return jsonify({
        'text': text,
        'detectedLanguage': detected_language
    })
