import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.connection import engine
from database.base import Base

# Import models to ensure they are registered with the declarative Base before create_all
from models.user import User
from models.loan import Loan
from models.ai_history import AIHistory

# Import routers
from routes.auth import router as auth_router
from routes.loans import router as loans_router
from routes.ai import router as ai_router
from routes.admin import router as admin_router

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Powered Debt Relief & Financial Recovery API",
    description="Backend services for analyzing loan eligibility, credit risks, and financial planning.",
    version="1.0.0"
)

# Enable CORS for frontend integration
# React dev server usually runs on http://localhost:5173 or http://localhost:3000
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(loans_router)
app.include_router(ai_router)
app.include_router(admin_router)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "Welcome to the AI Powered Debt Relief & Financial Recovery Platform API.",
        "docs_url": "/docs"
    }
