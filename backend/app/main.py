from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.database import create_db_and_tables
from backend.app.routers import auth, users, providers, bookings, reviews, admin

app = FastAPI(title="Local Service Finder – Neighborhood Helper App")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(providers.router, prefix="/providers", tags=["Providers"])
app.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
app.include_router(reviews.router, prefix="/reviews", tags=["Reviews"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Local Service Finder API"}
