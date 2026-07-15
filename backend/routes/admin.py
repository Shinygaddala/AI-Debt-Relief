from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict, Any

from database.connection import get_db
from models.user import User
from models.loan import Loan
from models.ai_history import AIHistory
from schemas.user import UserResponse
from schemas.loan import LoanResponse, LoanUpdateStatus
from auth.dependencies import get_admin_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin Operations"]
)

# ==========================================================
# USER MANAGEMENT
# ==========================================================

@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.put("/users/{user_id}/make-admin")
def make_admin(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.role == "ADMIN":
        raise HTTPException(
            status_code=400,
            detail="User is already an admin"
        )

    user.role = "ADMIN"

    db.commit()

    return {
        "message": f"{user.name} is now an ADMIN."
    }


@router.put("/users/{user_id}/remove-admin")
def remove_admin(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot remove your own admin role."
        )

    user.role = "USER"

    db.commit()

    return {
        "message": f"{user.name} is now a USER."
    }


@router.delete("/users/{user_id}")
def delete_user(
    user_id: int,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account."
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }

# ==========================================================
# LOAN MANAGEMENT
# ==========================================================

@router.get("/loans", response_model=List[LoanResponse])
def get_all_loans(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    return db.query(Loan).order_by(
        Loan.created_at.desc()
    ).all()


@router.put("/loan/{loan_id}", response_model=LoanResponse)
def update_loan_status(
    loan_id: int,
    status_data: LoanUpdateStatus,
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    loan = db.query(Loan).filter(
        Loan.id == loan_id
    ).first()

    if not loan:
        raise HTTPException(
            status_code=404,
            detail="Loan not found"
        )

    status_upper = status_data.status.upper()

    if status_upper not in [
        "APPROVED",
        "REJECTED",
        "PENDING"
    ]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status."
        )

    loan.status = status_upper

    db.commit()
    db.refresh(loan)

    return loan

# ==========================================================
# DASHBOARD STATISTICS
# ==========================================================

@router.get("/stats", response_model=Dict[str, Any])
def get_dashboard_stats(
    admin: User = Depends(get_admin_user),
    db: Session = Depends(get_db)
):

    total_users = db.query(User).filter(
        User.role == "USER"
    ).count()

    total_admins = db.query(User).filter(
        User.role == "ADMIN"
    ).count()

    total_loans = db.query(Loan).count()

    approved_loans = db.query(Loan).filter(
        Loan.status == "APPROVED"
    ).count()

    pending_loans = db.query(Loan).filter(
        Loan.status == "PENDING"
    ).count()

    rejected_loans = db.query(Loan).filter(
        Loan.status == "REJECTED"
    ).count()

    total_requested_capital = db.query(
        func.sum(Loan.amount)
    ).scalar() or 0

    approved_capital = db.query(
        func.sum(Loan.amount)
    ).filter(
        Loan.status == "APPROVED"
    ).scalar() or 0

    risk_distribution = {
        "Eligible":
            db.query(AIHistory).filter(
                AIHistory.prediction == "Eligible"
            ).count(),

        "Moderate Risk":
            db.query(AIHistory).filter(
                AIHistory.prediction == "Moderate Risk"
            ).count(),

        "High Risk":
            db.query(AIHistory).filter(
                AIHistory.prediction == "High Risk"
            ).count(),

        "Rejected":
            db.query(AIHistory).filter(
                AIHistory.prediction == "Rejected"
            ).count(),
    }

    trend_raw = db.query(
        func.strftime(
            "%Y-%m",
            Loan.created_at
        ).label("month"),
        func.count(
            Loan.id
        ).label("count")
    ).group_by(
        "month"
    ).order_by(
        "month"
    ).all()

    monthly_trend = {
        item[0]: item[1]
        for item in trend_raw
    }

    return {
        "total_users": total_users,
        "total_admins": total_admins,
        "total_loans": total_loans,
        "approved_loans": approved_loans,
        "pending_loans": pending_loans,
        "rejected_loans": rejected_loans,
        "total_requested_capital": total_requested_capital,
        "approved_capital": approved_capital,
        "risk_distribution": risk_distribution,
        "monthly_trend": monthly_trend
    }