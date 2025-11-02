import os
#sudo -u postgres psql -d test -c "GRANT USAGE, CREATE ON SCHEMA public TO test_user;"
class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://test_user:test@localhost:5432/test")
    SECRET_KEY = os.getenv("SECRET_KEY", "test_secret_key")
    SESSION_COOKIE_NAME = 'session'
    MISTRAL_API_KEY="GjZXqGBUpR0WNp3F69ozDMaEFlPXnwns"
