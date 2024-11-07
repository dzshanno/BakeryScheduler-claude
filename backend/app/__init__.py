# backend/app/__init__.py
import os
from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config
from app.database import db
from app.routes.shifts import shifts_bp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

migrate = Migrate()
jwt = JWTManager()


def create_app(config_name=None):
    app = Flask(__name__, static_folder="static")

    # Disable Flask's automatic slash behavior
    app.url_map.strict_slashes = False

    # If no config_name provided, get it from environment variable
    if config_name is None:
        config_name = os.getenv("FLASK_ENV", "development")

    print(f"Using configuration: {config_name}")  # Debug print

    # Get config class from config dictionary
    config_class = config[config_name]
    app.config.from_object(config_class)

    # Define CORS configuration
    CORS(
        app,
        resources={
            r"/*": {
                "origins": ["http://localhost:5173"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
                "supports_credentials": True,
                "expose_headers": ["Content-Range", "X-Content-Range"],
            }
        },
    )

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Configure JWT
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600  # 1 hour
    app.config["JWT_HEADER_TYPE"] = "Bearer"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]

    # Register blueprints
    from app.routes.auth import auth_bp
    from app.routes.users import users_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(shifts_bp, url_prefix="/api/shifts")  # Add this line

    # Register CLI commands
    from commands import create_tables, seed_db

    app.cli.add_command(create_tables)
    app.cli.add_command(seed_db)

    return app
