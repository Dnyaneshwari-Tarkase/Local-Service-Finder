import sys
import os

# Add the backend directory to the sys.path so that 'app' can be imported
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))

from app.main import app
