# backend/app/routes/users.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from app.models.user import User
from app import db

users_bp = Blueprint("users", __name__)


@users_bp.route("/", methods=["GET"])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify(
        [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
            for user in users
        ]
    )


@users_bp.route("/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )


@users_bp.route("/", methods=["POST"])
@jwt_required()
def create_user():
    data = request.get_json()

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"message": "Username already exists"}), 400

    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"message": "Email already exists"}), 400

    new_user = User(
        username=data["username"], email=data["email"], role=data.get("role", "baker")
    )
    new_user.set_password(data["password"])

    db.session.add(new_user)
    db.session.commit()

    return (
        jsonify(
            {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "role": new_user.role,
            }
        ),
        201,
    )


@users_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()

    if "username" in data:
        existing_user = User.query.filter_by(username=data["username"]).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"message": "Username already exists"}), 400
        user.username = data["username"]

    if "email" in data:
        existing_user = User.query.filter_by(email=data["email"]).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({"message": "Email already exists"}), 400
        user.email = data["email"]

    if "password" in data:
        user.set_password(data["password"])

    if "role" in data:
        user.role = data["role"]

    db.session.commit()

    return jsonify(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )


@users_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"})
