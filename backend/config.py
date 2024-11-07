import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:

    # Basic Flask configuration
    SECRET_KEY = os.getenv("SECRET_KEY")
    DEBUG = False
    TESTING = False

    # JWT configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(
        hours=int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "1"))
    )

    # Database configuration
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI = (
        f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
        f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    )

    # CORS configuration
    CORS_HEADERS = "Content-Type"
    CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False
    # When deploying to AWS, you might want to use AWS Secrets Manager for sensitive data

    # In production, you might want to be more strict with CORS
    CORS_ALLOWED_ORIGINS = os.getenv(
        "CORS_ALLOWED_ORIGINS", "https://your-production-domain.com"
    ).split(",")


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "postgresql:///test_baker_scheduling"


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
