from flask import Blueprint, request, jsonify
from src.services.article_service import create_article

bp = Blueprint('articles', __name__)

@bp.route('/api/articles', methods=['POST'])
def create():
    if request.is_json:
        data = request.get_json()
    else:
        data = request.form.to_dict()
    # TODO: user_id aus Auth ziehen
    user_id = 1
    article = create_article(data, user_id=user_id)
    return jsonify({
        'created_at': article.created_at.isoformat() if article.created_at else None
    }), 201