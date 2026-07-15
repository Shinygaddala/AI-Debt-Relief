import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database.connection import get_db
from models.user import User
from models.loan import Loan
from models.ai_history import AIHistory
from schemas.loan import LoanApply, LoanResponse
from services.ai_service import predict_loan_eligibility
from auth.dependencies import get_current_user

router = APIRouter(prefix="/loan", tags=["Loans"])

@router.post("/apply", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def apply_loan(loan_data: LoanApply, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Run the rule-based AI prediction
    prediction_result = predict_loan_eligibility(
        income=loan_data.income,
        existing_debt=loan_data.existing_debt,
        monthly_expense=loan_data.monthly_expense,
        employment_status=loan_data.employment_status,
        credit_score=loan_data.credit_score,
        loan_amount=loan_data.amount
    )
    
    # Create the loan object
    # Store the prediction output as a serialized JSON string in the database
    prediction_json = json.dumps(prediction_result)
    
    new_loan = Loan(
        user_id=current_user.id,
        loan_type=loan_data.loan_type,
        amount=loan_data.amount,
        income=loan_data.income,
        employment_status=loan_data.employment_status,
        purpose=loan_data.purpose,
        credit_score=loan_data.credit_score,
        monthly_expense=loan_data.monthly_expense,
        existing_debt=loan_data.existing_debt,
        status="PENDING",
        ai_prediction=prediction_json
    )
    
    db.add(new_loan)
    db.commit()
    db.refresh(new_loan)
    
    # Log this prediction automatically into the AIHistory table
    ai_history_entry = AIHistory(
        user_id=current_user.id,
        loan_id=new_loan.id,
        prediction=prediction_result["prediction"],
        confidence=prediction_result["confidence"],
        risk_score=prediction_result["risk_score"],
        reason=prediction_result["reason"],
        recommendation=prediction_result["recommendation"]
    )
    db.add(ai_history_entry)
    db.commit()
    
    return new_loan

@router.get("/my-loans", response_model=List[LoanResponse])
def get_my_loans(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    loans = db.query(Loan).filter(Loan.user_id == current_user.id).order_by(Loan.created_at.desc()).all()
    return loans

@router.get("/{id}", response_model=LoanResponse)
def get_loan_details(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == id).first()
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
        
    # Check authorization: user must own the loan OR be an admin
    if loan.user_id != current_user.id and current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this loan application"
        )
        
    return loan

@router.delete("/{id}", status_code=status.HTTP_200_OK)
def cancel_loan(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    loan = db.query(Loan).filter(Loan.id == id).first()
    if not loan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
        
    # Check ownership
    if loan.user_id != current_user.id and current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this loan application"
        )
        
    # Only allow cancellation if status is PENDING
    if loan.status != "PENDING" and current_user.role.upper() != "ADMIN":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending loan applications can be canceled"
        )
        
    db.delete(loan)
    db.commit()
    return {"message": f"Loan application {id} successfully deleted/canceled"}
