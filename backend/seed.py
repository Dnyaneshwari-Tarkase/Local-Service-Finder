from sqlmodel import Session, create_engine, select
from backend.app.models import User, ServiceProvider, UserRole, Booking, BookingStatus
from backend.app.auth import get_password_hash
from datetime import datetime, timedelta
import os

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")
engine = create_engine(DATABASE_URL)

def seed():
    with Session(engine) as session:
        # Create Admin
        admin = User(
            name="Admin User",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role=UserRole.ADMIN
        )
        session.add(admin)

        # Create Providers
        providers_data = [
            ("John Plumber", "john@plumber.com", "Plumber", 5, "1234567890", "110001"),
            ("Mike Sparky", "mike@electrician.com", "Electrician", 8, "0987654321", "110002"),
            ("Alice Painter", "alice@painter.com", "Painter", 3, "1122334455", "110001"),
        ]

        for name, email, svc, exp, contact, pin in providers_data:
            user = User(
                name=name,
                email=email,
                password_hash=get_password_hash("password123"),
                role=UserRole.PROVIDER
            )
            session.add(user)
            session.commit()
            session.refresh(user)

            provider = ServiceProvider(
                user_id=user.id,
                services=svc,
                experience=exp,
                contact_info=contact,
                location_pincode=pin,
                verified=True,
                rating_avg=4.5
            )
            session.add(provider)

        # Create Customer
        customer = User(
            name="Jane Doe",
            email="jane@example.com",
            password_hash=get_password_hash("password123"),
            role=UserRole.CUSTOMER
        )
        session.add(customer)
        session.commit()

        print("Seeding complete!")

if __name__ == "__main__":
    seed()
