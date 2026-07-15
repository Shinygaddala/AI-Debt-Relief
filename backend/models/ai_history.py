import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database.base import Base

class AIHistory(Base):
    __tablename__ = "ai_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    loan_id = Column(Integer, ForeignKey("loans.id", ondelete="CASCADE"), nullable=True)
    prediction = Column(String(20), nullable=False) # Eligible, Moderate Risk, High Risk, Rejected
    confidence = Column(Integer, nullable=False) # 0-100
    risk_score = Column(Integer, nullable=False) # 0-100
    recommendation = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="ai_history")
    loan = relationship("Loan", back_populates="ai_history_entries")
