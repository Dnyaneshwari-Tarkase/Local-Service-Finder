import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app

# This is required for Vercel to pick up the FastAPI app
# But since we imported 'app', it should be available as 'app'
