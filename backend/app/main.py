from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
import logging
import traceback
from app.database import create_db_and_tables
from app.routers import auth, users, providers, bookings, reviews, admin

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables
    create_db_and_tables()
    yield
    # Shutdown: Clean up if needed
    pass

app = FastAPI(
    title="Local Service Finder – Neighborhood Helper App",
    lifespan=lifespan
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Let FastAPI handle HTTPExceptions normally
    if isinstance(exc, HTTPException):
        raise exc

    logger.error(f"Global exception: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "message": "An unexpected error occurred. Please check the server logs for more details."},
    )

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
