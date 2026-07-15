from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from models.user import User
from models.ai_history import AIHistory
from schemas.ai import AIPredictionInput, AIPredictionResponse, AIHistoryResponse
from services.ai_service import predict_loan_eligibility
from auth.dependencies import get_current_user

router = APIRouter(tags=["AI Services"])

@router.post("/ai/predict", response_model=AIPredictionResponse)
def get_prediction(input_data: AIPredictionInput, current_user: User = Depends(get_current_user)):
    prediction_result = predict_loan_eligibility(
        income=input_data.income,
        existing_debt=input_data.existing_debt,
        monthly_expense=input_data.monthly_expense,
        employment_status=input_data.employment_status,
        credit_score=input_data.credit_score,
        loan_amount=input_data.loan_amount
    )
    return prediction_result

@router.get("/history", response_model=List[AIHistoryResponse])
def get_prediction_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Retrieve AI prediction history for current user
    history = db.query(AIHistory).filter(AIHistory.user_id == current_user.id).order_by(AIHistory.created_at.desc()).all()
    return history

