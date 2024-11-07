from app.database import db

# Import models in dependency order
from app.models.user import User
from app.models.shift import Shift
from app.models.shift_staff import ShiftStaff
from app.models.availability import Availability

# Make models available at package level
__all__ = ["User", "Shift", "ShiftStaff", "Availability"]
