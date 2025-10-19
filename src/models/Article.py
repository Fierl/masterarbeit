from src.database import db
from datetime import datetime, timezone

class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    bulletpoints = db.Column(db.Text)
    roofline = db.Column(db.Text)
    headline = db.Column(db.Text)
    subline = db.Column(db.Text)
    text = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))