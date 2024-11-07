from app.database import db
from datetime import datetime


class Shift(db.Model):
    __tablename__ = "shifts"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.String(8), nullable=False)  # HH:MM:SS format
    end_time = db.Column(db.String(8), nullable=False)  # HH:MM:SS format
    required_staff = db.Column(db.Integer, nullable=False, default=1)
    status = db.Column(db.String(50), nullable=False, default="draft")
    # Status options: draft, published, completed, cancelled
    employee_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    # Relationships
    employee = db.relationship("User", backref=db.backref("shifts", lazy=True))

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    @property
    def assigned_staff(self):
        return [assignment.staff for assignment in self.staff_assignments]

    @property
    def confirmed_staff_count(self):
        return sum(
            1
            for assignment in self.staff_assignments
            if assignment.status == "confirmed"
        )
