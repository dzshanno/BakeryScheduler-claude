# backend/app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from app.models.user import User
from app import db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST", "OPTIONS"])
@cross_origin()
def login():
    if request.method == "OPTIONS":
        # Handle preflight request
        return jsonify({}), 200

    data = request.get_json()

    if not data or not data.get("username") or not data.get("password"):
        return jsonify({"message": "Missing username or password"}), 400

    user = User.query.filter_by(username=data["username"]).first()

    if user and user.check_password(data["password"]):
        access_token = create_access_token(
            identity=user.username, additional_claims={"role": user.role}
        )
        return jsonify(
            {"token": access_token, "username": user.username, "role": user.role}
        )

    return jsonify({"message": "Invalid username or password"}), 401


@auth_bp.route("/me", methods=["GET"])
@jwt_required()
@cross_origin()
def get_current_user():
    current_user_username = get_jwt_identity()
    user = User.query.filter_by(username=current_user_username).first()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({"username": user.username, "email": user.email, "role": user.role})
