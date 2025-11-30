from src.database import db
from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
import json


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    custom_system_prompts = db.Column(db.Text, nullable=True)

    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def get_custom_prompts(self):
        """Get custom system prompts as dictionary"""
        if self.custom_system_prompts:
            try:
                return json.loads(self.custom_system_prompts)
            except json.JSONDecodeError:
                return {}
        return {}
    
    def set_custom_prompts(self, prompts_dict):
        """Set custom system prompts from dictionary"""
        self.custom_system_prompts = json.dumps(prompts_dict)
    
    def get_custom_prompt(self, field_name):
        """Get custom system prompt for a specific field"""
        prompts = self.get_custom_prompts()
        return prompts.get(field_name)
    
    def set_custom_prompt(self, field_name, prompt_text):
        """Set custom system prompt for a specific field"""
        prompts = self.get_custom_prompts()
        prompts[field_name] = prompt_text
        self.set_custom_prompts(prompts)
    
    def __repr__(self):
        return f'<User {self.username}>'
