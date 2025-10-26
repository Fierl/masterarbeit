from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


from app import app
from src.database import db
import src.models.User as _u
from werkzeug.security import generate_password_hash

def create_user():
    with app.app_context():
        username = "testuser"
        raw_password = "test"

        if _u.User.query.filter_by(username=username).first():
            print("User existiert bereits")
            return

        user = _u.User(
            username=username,
            password_hash=generate_password_hash(raw_password)
        )
        db.session.add(user)
        db.session.commit()
        print("User erstellt:", username)

if __name__ == "__main__":
    create_user()