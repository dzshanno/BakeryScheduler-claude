# backend/app/routes/auth.py
from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models.user import User
from app import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"message": "Missing username or password"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        access_token = create_access_token(
            identity=user.id, additional_claims={"role": user.role}
        )
        return jsonify(
            {"token": access_token, "username": user.username, "role": user.role}
        )

    return jsonify({"message": "Invalid username or password"}), 401


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
        }
    )
