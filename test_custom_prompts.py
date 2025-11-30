"""
Test script to check if custom prompts are working
"""

from app import app
from src.database import db
from src.models.User import User
from sqlalchemy import inspect

with app.app_context():
    # Check if column exists
    inspector = inspect(db.engine)
    columns = [col['name'] for col in inspector.get_columns('users')]
    
    print("=== Database Column Check ===")
    print(f"Columns in 'users' table: {columns}")
    print(f"'custom_system_prompts' exists: {'custom_system_prompts' in columns}")
    print()
    
    # Get first user
    user = User.query.first()
    
    if user:
        print(f"=== User: {user.username} ===")
        print(f"custom_system_prompts (raw): {user.custom_system_prompts}")
        print(f"get_custom_prompts(): {user.get_custom_prompts()}")
        
        # Test for each field
        fields = ['roofline', 'headline', 'subline', 'teaser', 'text']
        for field in fields:
            custom = user.get_custom_prompt(field)
            print(f"  {field}: {'CUSTOM' if custom else 'DEFAULT'}")
            if custom:
                print(f"    -> {custom[:50]}...")
    else:
        print("No users found in database")
