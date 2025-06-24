from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from config import Config

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.groups import groups_bp
    from app.routes.sessions import sessions_bp
    from app.routes.memberships import memberships_bp
    from app.routes.messages import messages_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(groups_bp, url_prefix='/groups')
    app.register_blueprint(sessions_bp, url_prefix='/sessions')
    app.register_blueprint(memberships_bp, url_prefix='/memberships')
    app.register_blueprint(messages_bp, url_prefix='/messages')

    return app
