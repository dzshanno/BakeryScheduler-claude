# seed_database.py
from datetime import datetime, date, timedelta
from werkzeug.security import generate_password_hash
from app import create_app
from app.database import db
from app.models.user import User
from app.models.shift import Shift
from app.models.shift_staff import ShiftStaff
from sqlalchemy import text


def reset_sequences():
    """Reset all primary key sequences to start from 1"""
    with db.engine.connect() as connection:
        connection.execute(text("ALTER SEQUENCE users_id_seq RESTART WITH 1;"))
        connection.execute(text("ALTER SEQUENCE shifts_id_seq RESTART WITH 1;"))
        connection.execute(text("ALTER SEQUENCE shift_staff_id_seq RESTART WITH 1;"))
        connection.commit()


def clear_tables():
    """Clear all tables in the correct order"""
    print("Clearing existing data...")
    db.session.execute(text("TRUNCATE TABLE shift_staff CASCADE;"))
    db.session.execute(text("TRUNCATE TABLE shifts CASCADE;"))
    db.session.execute(text("TRUNCATE TABLE users CASCADE;"))
    db.session.commit()
    print("All tables cleared.")


def get_next_month_weekend_dates():
    dates = []
    current = date.today()
    end_date = current + timedelta(days=30)

    while current <= end_date:
        # 3 = Thursday, 4 = Friday, 5 = Saturday
        if current.weekday() in [3, 4, 5]:
            dates.append(current)
        current += timedelta(days=1)
    return dates


def seed_database():
    # Create application context
    app = create_app()
    with app.app_context():
        try:
            # Clear all existing data and reset sequences
            clear_tables()
            reset_sequences()

            print("Creating users...")
            # Create users
            users = [
                User(username="admin", email="admin@bakery.com", role="admin"),
                User(username="manager1", email="manager1@bakery.com", role="manager"),
                User(username="sarah.baker", email="sarah@bakery.com", role="baker"),
                User(username="mike.baker", email="mike@bakery.com", role="baker"),
                User(username="emma.baker", email="emma@bakery.com", role="baker"),
            ]

            # Set passwords
            users[0].set_password("admin123")
            users[1].set_password("manager123")
            users[2].set_password("baker123")
            users[3].set_password("baker123")
            users[4].set_password("baker123")

            # Add users to session
            for user in users:
                db.session.add(user)

            db.session.commit()
            print("Users created successfully!")

            print("Creating shifts...")
            # Create shifts
            weekend_dates = get_next_month_weekend_dates()
            shifts = []

            for current_date in weekend_dates:
                # Morning shift
                morning_shift = Shift(
                    date=current_date,
                    start_time="05:00:00",
                    end_time="13:00:00",
                    required_staff=2,
                    status=(
                        "published"
                        if current_date <= date.today() + timedelta(days=7)
                        else "draft"
                    ),
                    employee_id=2,  # Created by manager1
                )
                shifts.append(morning_shift)

                # Afternoon shift
                afternoon_shift = Shift(
                    date=current_date,
                    start_time="13:00:00",
                    end_time="21:00:00",
                    required_staff=2,
                    status=(
                        "published"
                        if current_date <= date.today() + timedelta(days=7)
                        else "draft"
                    ),
                    employee_id=2,  # Created by manager1
                )
                shifts.append(afternoon_shift)

            # Add shifts to session
            for shift in shifts:
                db.session.add(shift)

            db.session.commit()
            print("Shifts created successfully!")

            print("Creating shift assignments...")
            # Create shift assignments for published shifts
            for shift in shifts:
                if shift.status == "published":
                    if "05:00:00" in shift.start_time:
                        # Morning shift assignments
                        assignments = [
                            ShiftStaff(
                                shift_id=shift.id, staff_id=3, status="confirmed"
                            ),
                            ShiftStaff(
                                shift_id=shift.id, staff_id=4, status="cancelled"
                            ),
                            ShiftStaff(
                                shift_id=shift.id, staff_id=5, status="available"
                            ),
                        ]
                    else:
                        # Afternoon shift assignments
                        assignments = [
                            ShiftStaff(shift_id=shift.id, staff_id=3, status="pending"),
                            ShiftStaff(shift_id=shift.id, staff_id=4, status="offered"),
                        ]

                    # Add assignments to session
                    for assignment in assignments:
                        db.session.add(assignment)

            db.session.commit()
            print("Shift assignments created successfully!")

            # Print summary
            print("\nDatabase seeded successfully!")
            print(f"Created {len(users)} users")
            print(f"Created {len(shifts)} shifts")
            print(f"Created {ShiftStaff.query.count()} shift assignments")

        except Exception as e:
            print(f"Error occurred: {str(e)}")
            db.session.rollback()
            raise


if __name__ == "__main__":
    seed_database()
