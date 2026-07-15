from pydantic import BaseModel, Field
from typing import Optional, Any
from datetime import datetime

class LoanBase(BaseModel):
    loan_type: str = Field(..., examples=["Personal", "Debt Consolidation", "Credit Card Relief"])
    amount: float = Field(..., gt=0, examples=[10000.0])
    income: float = Field(..., gt=0, examples=[60000.0]) # Annual Income
    employment_status: str = Field(..., examples=["Employed", "Self-Employed", "Unemployed", "Retired"])
    purpose: str = Field(..., min_length=5, examples=["To pay off credit card debts."])
    credit_score: int = Field(..., ge=300, le=850, examples=[720])
    monthly_expense: float = Field(..., ge=0, examples=[1500.0])
    existing_debt: float = Field(..., ge=0, examples=[5000.0])

class LoanApply(LoanBase):
    pass

class LoanUpdateStatus(BaseModel):
    status: str = Field(..., examples=["APPROVED", "REJECTED"])

class LoanResponse(LoanBase):
    id: int
    user_id: int
    status: str
    ai_prediction: Optional[str] = None # JSON string
    created_at: datetime

    class Config:
        from_attributes = True
