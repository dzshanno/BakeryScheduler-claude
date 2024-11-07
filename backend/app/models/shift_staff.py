from app.database import db
from datetime import datetime
from app.models.user import User  # Add this import
from app.models.shift import Shift  # Add this import


class ShiftStaff(db.Model):
    __tablename__ = "shift_staff"

    id = db.Column(db.Integer, primary_key=True)
    shift_id = db.Column(db.Integer, db.ForeignKey("shifts.id"), nullable=False)
    staff_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")
    # Status options: pending, available, offered, confirmed, cancelled

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    shift = db.relationship("Shift", backref=db.backref("staff_assignments", lazy=True))
    staff = db.relationship("User", backref=db.backref("shift_assignments", lazy=True))
