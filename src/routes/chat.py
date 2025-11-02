from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.services.article_service import *
from src.models.Chat import Chat
from src.database import db
from src.services.generation_service import generate_content

bp = Blueprint('chats', __name__)

@bp.route('/api/chats/generate', methods=['POST'])
@login_required
def generate_chat():
    data = request.get_json()
    article_id = data.get('article_id')
    field_name = data.get('field_name')
    prompt = data.get('prompt')
    context = data.get('context', '')
    
    if not all([article_id, field_name, prompt]):
        return jsonify({'error': 'article_id, field_name und prompt sind erforderlich'}), 400
    
    if field_name not in ['headline', 'subline', 'roofline', 'text']:
        return jsonify({'error': 'Ungültiger field_name'}), 400

    generated_content = generate_content(prompt, field_name=field_name, context=context)

    chat = Chat(
        article_id=article_id,
        field_name=field_name,
        chat_type='generate',
        content=generated_content
    )
    
    db.session.add(chat)
    db.session.commit()
    
    return jsonify({
        'id': chat.id,
        'article_id': chat.article_id,
        'field_name': chat.field_name,
        'chat_type': chat.chat_type,
        'content': chat.content,
        'created_at': chat.created_at.isoformat()
    }), 201

@bp.route('/api/chats/edit', methods=['POST'])
@login_required
def edit_chat():
    data = request.get_json()
    article_id = data.get('article_id')
    field_name = data.get('field_name')
    content = data.get('content')
    
    if not all([article_id, field_name, content]):
        return jsonify({'error': 'article_id, field_name und content sind erforderlich'}), 400
    
    if field_name not in ['headline', 'subline', 'roofline', 'text']:
        return jsonify({'error': 'Ungültiger field_name'}), 400
    
    chat = Chat(
        article_id=article_id,
        field_name=field_name,
        chat_type='edit',
        content=content
    )
    
    db.session.add(chat)
    db.session.commit()
    
    return jsonify({
        'id': chat.id,
        'article_id': chat.article_id,
        'field_name': chat.field_name,
        'chat_type': chat.chat_type,
        'content': chat.content,
        'created_at': chat.created_at.isoformat()
    }), 201

@bp.route('/api/chats', methods=['GET'])
@login_required
def list_chats():
    article_id = request.args.get('article_id', type=int)
    field_name = request.args.get('field_name')
    chat_type = request.args.get('chat_type')
    
    if not article_id or not field_name:
        return jsonify({'error': 'article_id und field_name sind erforderlich'}), 400
    
    if field_name not in ['headline', 'subline', 'roofline', 'text']:
        return jsonify({'error': 'Ungültiger field_name'}), 400
    
    if chat_type and chat_type not in ['generate', 'edit']:
        return jsonify({'error': 'Ungültiger chat_type'}), 400
    
    query = Chat.query.filter_by(
        article_id=article_id,
        field_name=field_name
    )
    
    if chat_type:
        query = query.filter_by(chat_type=chat_type)
    
    chats = query.order_by(Chat.created_at.desc()).all()
    
    return jsonify([{
        'id': chat.id,
        'article_id': chat.article_id,
        'field_name': chat.field_name,
        'chat_type': chat.chat_type,
        'content': chat.content,
        'created_at': chat.created_at.isoformat()
    } for chat in chats]), 200