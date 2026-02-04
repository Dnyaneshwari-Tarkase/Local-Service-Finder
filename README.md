# Local Service Finder – Neighborhood Helper App

This project consists of a FastAPI backend and a React.js frontend.

## Prerequisites
- Python 3.12+
- Node.js 22+
- Docker & Docker Compose (optional)

## Running with Docker (Recommended)
```bash
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`
- API Docs: `http://localhost:8000/docs`

## Manual Setup

### 1. Backend
```bash
cd backend
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database (creates admin and sample data)
python seed.py

# Run the server
uvicorn app.main:app --reload
```

### 2. Frontend
```bash
cd frontend
# Install dependencies
npm install

# Run the development server
npm run dev
```
By default, the frontend will run on `http://localhost:5173` (or the port shown in the terminal).

## Default Credentials (from seed.py)
- **Admin**: `admin@example.com` / `admin123`
- **Customer**: `jane@example.com` / `password123`
- **Provider**: `john@plumber.com` / `password123`
