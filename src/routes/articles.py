from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from src.services.article_service import *

bp = Blueprint('articles', __name__)

@bp.route('/api/articles', methods=['POST'])
@login_required
def create():
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    
    # Get user_id from authenticated user
    user_id = current_user.id
    article = create_article(data, user_id=user_id)
    return jsonify({
        'created_at': article.created_at.isoformat() if article.created_at else None
    }), 201

@bp.route('/api/articles', methods=['GET'])
@login_required
def list_articles():
    # Get user_id from authenticated user
    user_id = current_user.id
    articles = get_articles(user_id=user_id)
    result = []
    for a in articles:
        result.append({
            'id': a.id,
            'bulletpoints': a.bulletpoints,
            'roofline': a.roofline,
            'headline': a.headline,
            'subline': a.subline,
            'text': a.text,
            'created_at': a.created_at.isoformat() if a.created_at else None
        })
    return jsonify(result), 200