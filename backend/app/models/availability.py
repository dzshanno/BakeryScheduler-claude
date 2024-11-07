from app.database import db
from datetime import datetime


class Availability(db.Model):
    __tablename__ = "availabilities"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    day_of_week = db.Column(db.Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = db.Column(db.String(8), nullable=False)  # HH:MM:SS format
    end_time = db.Column(db.String(8), nullable=False)  # HH:MM:SS format
    is_recurring = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.Date, nullable=True)  # For non-recurring availability
    end_date = db.Column(db.Date, nullable=True)  # For non-recurring availability

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationship
    user = db.relationship("User", backref=db.backref("availabilities", lazy=True))
