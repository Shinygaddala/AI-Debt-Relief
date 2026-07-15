from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class AIPredictionInput(BaseModel):
    income: float = Field(..., gt=0, description="Annual Income", examples=[60000.0])
    existing_debt: float = Field(..., ge=0, description="Total outstanding debt", examples=[5000.0])
    monthly_expense: float = Field(..., ge=0, description="Monthly living expenses", examples=[1500.0])
    employment_status: str = Field(..., description="Employment status", examples=["Employed", "Self-Employed", "Unemployed", "Retired"])
    credit_score: int = Field(..., ge=300, le=850, description="Credit score", examples=[720])
    loan_amount: float = Field(..., gt=0, description="Amount of loan requested", examples=[10000.0])

class AIPredictionResponse(BaseModel):
    prediction: str = Field(..., description="Eligible, Moderate Risk, High Risk, Rejected", examples=["Eligible"])
    confidence: int = Field(..., ge=0, le=100, description="Confidence percentage", examples=[94])
    risk_score: int = Field(..., ge=0, le=100, description="Risk Score out of 100", examples=[18])
    reason: str = Field(..., description="Explanation of factors considered", examples=["Low DTI ratio, stable income, and good credit score."])
    recommendation: str = Field(..., description="Actionable financial advice", examples=["Loan can be approved safely."])

class AIHistoryResponse(AIPredictionResponse):
    id: int
    user_id: int
    loan_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True
