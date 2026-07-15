import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.base import Base

class Loan(Base):
    __tablename__ = "loans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    loan_type = Column(String(50), nullable=False)
    amount = Column(Float, nullable=False)
    income = Column(Float, nullable=False)
    employment_status = Column(String(50), nullable=False)
    purpose = Column(Text, nullable=False)
    credit_score = Column(Integer, nullable=False)
    monthly_expense = Column(Float, nullable=False)
    existing_debt = Column(Float, nullable=False)
    status = Column(String(20), nullable=False, default="PENDING") # PENDING, APPROVED, REJECTED
    ai_prediction = Column(Text, nullable=True) # JSON serialized string of AI response
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="loans")
    ai_history_entries = relationship("AIHistory", back_populates="loan", cascade="all, delete-orphan")
