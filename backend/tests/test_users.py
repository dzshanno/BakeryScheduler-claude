# backend/tests/test_users.py
import json
from app.models.user import User
from app.database import db


def test_get_users(test_client):
    response = test_client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json, list)


def test_get_user(test_client, new_user):
    # Add a user to the database
    db.session.add(new_user)
    db.session.commit()

    response = test_client.get(f"/users/{new_user.id}")
    assert response.status_code == 200
    assert response.json["username"] == new_user.username
    assert response.json["email"] == new_user.email


def test_create_user(test_client):
    user_data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "password",
    }
    response = test_client.post(
        "/users/", data=json.dumps(user_data), content_type="application/json"
    )
    assert response.status_code == 201
    assert response.json["username"] == user_data["username"]
    assert response.json["email"] == user_data["email"]
