from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import Shift, ShiftStaff, User  # Update this import
from app.database import db

shifts_bp = Blueprint("shifts", __name__)

SHIFT_STATUSES = [
    "no-shift",
    "has-shift",
    "pending-availability",
    "confirmed-availability",
    "cancelled-availability",
]


@shifts_bp.route("", methods=["GET"])
@jwt_required()
def get_shifts():
    try:
        start = request.args.get("start")
        end = request.args.get("end")

        query = Shift.query
        if start and end:
            query = query.filter(
                Shift.date >= datetime.fromisoformat(start),
                Shift.date <= datetime.fromisoformat(end),
            )

        shifts = query.all()
        return jsonify(
            {
                "shifts": [
                    {
                        "id": shift.id,
                        "title": f"Shift ({shift.confirmed_staff_count}/{shift.required_staff})",
                        "start": f"{shift.date}T{shift.start_time}",
                        "end": f"{shift.date}T{shift.end_time}",
                        "status": shift.status,
                        "required_staff": shift.required_staff,
                        "staff": [
                            {
                                "id": assignment.staff.id,
                                "username": assignment.staff.username,
                                "status": assignment.status,
                            }
                            for assignment in shift.staff_assignments
                        ],
                    }
                    for shift in shifts
                ]
            }
        )
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@shifts_bp.route("", methods=["POST"])
@jwt_required()
def create_shift():
    try:
        data = request.get_json()

        new_shift = Shift(
            date=datetime.fromisoformat(data["date"]).date(),
            start_time=data["startTime"],
            end_time=data["endTime"],
            required_staff=data.get("requiredStaff", 1),
            status="draft",
        )

        db.session.add(new_shift)

        # Add initial staff assignments if provided
        if "staff" in data:
            for staff_username in data["staff"]:
                staff = User.query.filter_by(username=staff_username).first()
                if staff:
                    assignment = ShiftStaff(
                        shift=new_shift, staff=staff, status="pending"
                    )
                    db.session.add(assignment)

        db.session.commit()

        return (
            jsonify(
                {
                    "id": new_shift.id,
                    "date": data["date"],
                    "start_time": new_shift.start_time,
                    "end_time": new_shift.end_time,
                    "required_staff": new_shift.required_staff,
                    "status": new_shift.status,
                    "staff": [
                        {
                            "id": assignment.staff.id,
                            "username": assignment.staff.username,
                            "status": assignment.status,
                        }
                        for assignment in new_shift.staff_assignments
                    ],
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@shifts_bp.route("/<int:shift_id>/staff", methods=["POST"])
@jwt_required()
def assign_staff(shift_id):
    try:
        shift = Shift.query.get_or_404(shift_id)
        data = request.get_json()

        staff = User.query.filter_by(username=data["username"]).first()
        if not staff:
            return jsonify({"message": "Staff member not found"}), 404

        existing = ShiftStaff.query.filter_by(
            shift_id=shift.id, staff_id=staff.id
        ).first()

        if existing:
            existing.status = data.get("status", "pending")
        else:
            assignment = ShiftStaff(
                shift=shift, staff=staff, status=data.get("status", "pending")
            )
            db.session.add(assignment)

        db.session.commit()
        return jsonify({"message": "Staff assignment updated successfully"})

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@shifts_bp.route("/<int:shift_id>", methods=["PUT"])
@jwt_required()
def update_shift(shift_id):
    try:
        shift = Shift.query.get_or_404(shift_id)
        data = request.get_json()

        if "status" in data and data["status"] in SHIFT_STATUSES:
            shift.status = data["status"]

        if "date" in data:
            shift.date = datetime.fromisoformat(data["date"]).date()

        if "startTime" in data:
            shift.start_time = data["startTime"]

        if "endTime" in data:
            shift.end_time = data["endTime"]

        if "employee" in data:
            employee = User.query.filter_by(username=data["employee"]).first()
            if not employee:
                return jsonify({"message": "Employee not found"}), 404
            shift.employee_id = employee.id

        db.session.commit()
        return jsonify(
            {
                "id": shift.id,
                "date": shift.date.isoformat(),
                "start_time": shift.start_time,
                "end_time": shift.end_time,
                "employee": shift.employee.username,
                "status": shift.status,
            }
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@shifts_bp.route("/<int:shift_id>", methods=["DELETE"])
@jwt_required()
def delete_shift(shift_id):
    try:
        shift = Shift.query.get_or_404(shift_id)
        db.session.delete(shift)
        db.session.commit()
        return jsonify({"message": "Shift deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500
