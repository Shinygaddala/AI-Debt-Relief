from typing import Dict, Any

def predict_loan_eligibility(
    income: float,
    existing_debt: float,
    monthly_expense: float,
    employment_status: str,
    credit_score: int,
    loan_amount: float
) -> Dict[str, Any]:
    # 1. Convert annual income to monthly
    monthly_income = income / 12.0 if income > 0 else 0
    
    # 2. Estimate monthly debt payments (assume credit card/loan servicing is 3% of existing debt)
    monthly_debt_service = existing_debt * 0.03
    total_monthly_obligations = monthly_debt_service + monthly_expense
    
    # 3. Calculate Debt-to-Income (DTI) ratio
    dti = (total_monthly_obligations / monthly_income * 100) if monthly_income > 0 else 100.0
    
    # 4. Calculate Loan-to-Income (LTI) ratio (annualized)
    lti = (loan_amount / income) if income > 0 else 100.0
    
    # 5. Base Risk Score calculation (0 to 100)
    risk_score = 0
    reasons = []
    
    # Credit Score Factors
    if credit_score < 500:
        risk_score += 55
        reasons.append("Critical: Credit score is in the poor range (below 500)")
    elif credit_score < 600:
        risk_score += 40
        reasons.append("Warning: Credit score is low (500-599)")
    elif credit_score < 700:
        risk_score += 20
        reasons.append("Moderate: Credit score is fair (600-699)")
    else:
        reasons.append("Positive: Strong credit score (700+)")
        
    # DTI Ratio Factors
    if dti > 60:
        risk_score += 30
        reasons.append(f"Critical: Debt-to-Income (DTI) ratio is extremely high ({dti:.1f}%)")
    elif dti > 40:
        risk_score += 20
        reasons.append(f"Warning: Debt-to-Income (DTI) ratio is high ({dti:.1f}%)")
    elif dti > 25:
        risk_score += 10
        reasons.append(f"Moderate: Debt-to-Income (DTI) ratio is average ({dti:.1f}%)")
    else:
        reasons.append(f"Positive: Excellent DTI ratio ({dti:.1f}%)")
        
    # Employment Status Factors
    emp_status_lower = employment_status.lower().strip()
    if emp_status_lower == "unemployed":
        risk_score += 35
        reasons.append("Critical: Current employment status is Unemployed")
    elif emp_status_lower == "retired":
        risk_score += 15
        reasons.append("Moderate: Fixed retirement income")
    elif emp_status_lower == "self-employed":
        risk_score += 10
        reasons.append("Moderate: Variable self-employed income stream")
    else:
        reasons.append("Positive: Stable salaried employment")
        
    # Loan-to-Income (LTI) Factors
    if lti > 0.5:
        risk_score += 25
        reasons.append(f"Warning: Loan amount requested is over 50% of annual income ({lti*100:.1f}%)")
    elif lti > 0.3:
        risk_score += 15
        reasons.append(f"Moderate: Loan amount requested is substantial relative to income ({lti*100:.1f}%)")
    else:
        reasons.append(f"Positive: Loan amount requested is well within income limit ({lti*100:.1f}%)")
        
    # Clamp risk score
    risk_score = max(0, min(100, risk_score))
    
    # 6. Apply hard override rules
    prediction = "Eligible"
    confidence = 90
    
    if credit_score < 500:
        prediction = "Rejected"
        confidence = 96
        risk_score = max(90, risk_score)
        reasons.append("Automatic Rejection: Credit score below minimum threshold of 500")
    elif dti > 75:
        prediction = "Rejected"
        confidence = 94
        risk_score = max(88, risk_score)
        reasons.append("Automatic Rejection: Debt-to-Income ratio exceeds safety limit of 75%")
    elif emp_status_lower == "unemployed" and credit_score < 600:
        prediction = "Rejected"
        confidence = 92
        risk_score = max(85, risk_score)
        reasons.append("Automatic Rejection: Unemployed with sub-600 credit rating")
    else:
        # Determine prediction category based on accumulated risk score
        if risk_score >= 70:
            prediction = "High Risk"
            confidence = 85
        elif risk_score >= 40:
            prediction = "Moderate Risk"
            confidence = 80
        else:
            prediction = "Eligible"
            confidence = 92
            
    # Modify confidence slightly based on consistency of indicators
    # e.g., if credit score is excellent but DTI is terrible, reduce confidence
    if (credit_score >= 700 and dti > 50) or (credit_score < 550 and dti < 20):
        confidence -= 10
    
    # 7. Formulate recommendation
    if prediction == "Rejected":
        recommendation = (
            "We recommend focusing on basic debt restructuring before seeking new loans. "
            "1. Leverage our Settlement Calculator to target a 40-50% settlement on old credit lines. "
            "2. Utilize the Negotiation Email Generator to send formal hardship request letters to active creditors. "
            "3. Pause new applications to prevent hard credit inquiries that further depress your score."
        )
    elif prediction == "High Risk":
        recommendation = (
            "Approval is unlikely or would carry unfavorable terms. "
            "1. Consider debt consolidation rather than fresh borrowing. "
            "2. Use the Debt Payoff Calculator (Debt Avalanche method) to pay off high-interest debt first. "
            "3. Request a co-signer or provide collateral if proceeding with this application."
        )
    elif prediction == "Moderate Risk":
        recommendation = (
            "Approval is possible but interest rates may be elevated. "
            "1. Try to reduce the loan amount requested to improve your Debt-to-Income (DTI) profile. "
            "2. Keep the loan repayment term short (e.g., under 36 months) to minimize total interest paid. "
            "3. Ensure stable, documented income is ready for verification."
        )
    else: # Eligible
        recommendation = (
            "Congratulations! Your profile is highly competitive. "
            "1. Ensure you shop for prime market interest rates. "
            "2. Establish automated repayments to preserve your strong payment history. "
            "3. Keep emergency savings active to cover at least 3 months of EMI commitments."
        )
        
    reason_str = " | ".join([r for r in reasons if "Critical" in r or "Warning" in r or "Rejection" in r])
    if not reason_str:
        reason_str = "All indicators look healthy. Stable income, acceptable debt obligations, and good credit standings."
        
    return {
        "prediction": prediction,
        "confidence": confidence,
        "risk_score": risk_score,
        "reason": reason_str,
        "recommendation": recommendation
    }
