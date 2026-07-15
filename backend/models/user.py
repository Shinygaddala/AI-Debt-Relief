import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(20), nullable=False, default="USER") # USER or ADMIN
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    loans = relationship("Loan", back_populates="user", cascade="all, delete-orphan")
    ai_history = relationship("AIHistory", back_populates="user", cascade="all, delete-orphan")
