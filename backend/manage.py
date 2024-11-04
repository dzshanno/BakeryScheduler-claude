# backend/manage.py
import os
from flask_migrate import Migrate, MigrateCommand
from flask.cli import FlaskGroup
from app import create_app, db
from app.models.user import User

app = create_app(os.getenv("FLASK_ENV", "default"))
cli = FlaskGroup(app)


@cli.command("create_db")
def create_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    """Seed the database with initial data."""
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


if __name__ == "__main__":
    cli()
