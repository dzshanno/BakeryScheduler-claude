# backend/app/__init__.py
import os
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Get CORS allowed origins from environment variable
    allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(
        ","
    )

    # Configure CORS
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": allowed_origins,
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "expose_headers": ["Content-Range", "X-Content-Range"],
            }
        },
    )
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")

    # Register CLI commands
    from commands import create_tables, seed_db

    app.cli.add_command(create_tables)
    app.cli.add_command(seed_db)

    @app.after_request
    def after_request(response):
        """Ensure proper CORS headers for all responses"""
        origin = request.headers.get("Origin")
        if origin and origin in allowed_origins:
            response.headers.add("Access-Control-Allow-Credentials", "true")
        return response

    return app
