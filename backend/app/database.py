import os
from sqlmodel import create_engine, Session, SQLModel
from dotenv import load_dotenv

load_dotenv()

# Default to SQLite for easier local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local_service_finder.db")

# Vercel check: The filesystem is read-only except for /tmp
if os.getenv("VERCEL") and DATABASE_URL.startswith("sqlite:///"):
    # Redirect SQLite to /tmp on Vercel
    db_filename = DATABASE_URL.split("/")[-1]
    DATABASE_URL = f"sqlite:////tmp/{db_filename}"

# Ensure the directory for the database exists if it's a file-based SQLite URL
if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    # Handle both sqlite:///path and sqlite:////path
    if db_path.startswith("/"):
        db_dir = os.path.dirname(db_path)
    else:
        db_dir = os.path.dirname(os.path.abspath(db_path))

    if db_dir and not os.path.exists(db_dir):
        try:
            os.makedirs(db_dir, exist_ok=True)
        except Exception as e:
            print(f"Error creating directory {db_dir}: {e}")

# SQLite connection arguments
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

_tables_created = False

def create_db_and_tables():
    global _tables_created
    # Import models here to ensure they are registered with SQLModel.metadata
    from app import models
    try:
        SQLModel.metadata.create_all(engine)
        _tables_created = True
    except Exception as e:
        print(f"Error creating tables: {e}")

def get_session():
    if not _tables_created:
        create_db_and_tables()
    with Session(engine) as session:
        yield session
