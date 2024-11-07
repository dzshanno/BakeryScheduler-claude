# backend/manage.py
import os
from flask_migrate import Migrate
from flask.cli import FlaskGroup
from app import create_app, db
from app.models.user import User
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get environment from ENV variable, default to 'development' if not set
env = os.getenv("FLASK_ENV", "development")

app = create_app(env)
cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    """Create a fresh database."""
    try:
        db.drop_all()
        db.create_all()
        db.session.commit()
        print(f"Database created successfully in {env} environment!")
    except Exception as e:
        print(f"Error creating database: {e}")


@cli.command("seed_db")
def seed_db():
    """Seed the database with initial data."""
    try:
        # Create admin user
        admin = User(username="admin", email="admin@example.com", role="admin")
        admin.set_password("admin123")

        # Create test manager
        manager = User(username="manager", email="manager@example.com", role="manager")
        manager.set_password("manager123")

        # Create test baker
        baker = User(username="baker", email="baker@example.com", role="baker")
        baker.set_password("baker123")

        db.session.add(admin)
        db.session.add(manager)
        db.session.add(baker)
        db.session.commit()
        print(f"Database seeded successfully in {env} environment!")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.session.rollback()


if __name__ == "__main__":
    cli()
