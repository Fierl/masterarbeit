from flask import Flask, render_template
from src.config.config import Config
from src.database import db
from src.routes.articles import bp as articles_bp
import src.models.User as _u
import src.models.Article as _a
import src.models.Chat as _c


app = Flask(__name__, template_folder='templates')
app.config.from_object(Config)
db.init_app(app)
app.register_blueprint(articles_bp)


with app.app_context():
    db.create_all()


@app.route('/')
def index():
    return render_template('create.html', username='Alice')


if __name__ == '__main__':
    app.run(debug=True)
