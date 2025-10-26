from flask import Flask, render_template, redirect, url_for
from flask_login import LoginManager, login_required, current_user
from src.config.config import Config
from src.database import db
from src.routes.articles import bp as articles_bp
from src.routes.auth import bp as auth_bp
import src.models.User as _u
import src.models.Article as _a
import src.models.Chat as _c


app = Flask(__name__, template_folder='templates')
app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Bitte melden Sie sich an, um diese Seite zu sehen.'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    from src.services.auth_service import AuthService
    return AuthService.get_user_by_id(user_id)

# Register blueprints
app.register_blueprint(articles_bp)
app.register_blueprint(auth_bp)


with app.app_context():
    db.create_all()


@app.route('/')
@login_required
def index():
    return render_template('create.html', username=current_user.username)


if __name__ == '__main__':
    app.run(debug=True)
