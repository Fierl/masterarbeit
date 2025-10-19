from src.database import db
from src.models.Article import Article

def create_article(payload, user_id):
    article = Article(
        user_id = user_id,
        bulletpoints = payload.get('bulletpoints'),
        roofline = payload.get('roofline'),
        headline = payload.get('headline'),
        subline = payload.get('subline'),
        text = payload.get('text')
    )
    db.session.add(article)
    db.session.commit()
    return article