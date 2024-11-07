# backend/commands.py
import click
from flask.cli import with_appcontext
from app.database import db
from app.models.user import User


@click.command(name="create-tables")
@with_appcontext
def create_tables():
    db.create_all()
    click.echo("Tables created successfully!")


@click.command(name="seed-db")
@with_appcontext
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

    try:
        db.session.commit()
        click.echo("Database seeded successfully!")
    except Exception as e:
        db.session.rollback()
        click.echo(f"Error seeding database: {str(e)}")
