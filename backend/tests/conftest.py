import pytest
from app import create_app, db
from app.models.user import User


@pytest.fixture(scope="module")
def test_client():
    flask_app = create_app("testing")

    # Create a test client using the Flask application configured for testing
    with flask_app.test_client() as testing_client:
        with flask_app.app_context():
            # Create the database and the database table(s)
            db.create_all()
            yield testing_client  # this is where the testing happens!
            db.drop_all()


@pytest.fixture(scope="module")
def new_user():
    user = User(username="testuser", email="testuser@example.com", password="password")
    return user
