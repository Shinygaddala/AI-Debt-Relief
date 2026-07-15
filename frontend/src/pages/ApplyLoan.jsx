import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Sparkles, HelpCircle, AlertCircle, Info } from 'lucide-react';

const ApplyLoan = () => {
  const [loanType, setLoanType] = useState('Debt Consolidation');
  const [amount, setAmount] = useState('');
  const [income, setIncome] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('Employed');
  const [creditScore, setCreditScore] = useState(650);
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [existingDebt, setExistingDebt] = useState('');
  const [purpose, setPurpose] = useState('');
  
  const [dti, setDti] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Dynamically calculate estimated Debt-to-Income (DTI) ratio
  useEffect(() => {
    const parsedIncome = parseFloat(income);
    const parsedDebt = parseFloat(existingDebt) || 0;
    const parsedExpense = parseFloat(monthlyExpense) || 0;

    if (parsedIncome > 0) {
      const monthlyIncome = parsedIncome / 12;
      const monthlyDebtEstimate = (parsedDebt * 0.03) + parsedExpense;
      const calculatedDti = (monthlyDebtEstimate / monthlyIncome) * 100;
      setDti(calculatedDti);
    } else {
      setDti(0);
    }
  }, [income, existingDebt, monthlyExpense]);

  const validateForm = () => {
    const tempErrors = {};
    if (!amount || parseFloat(amount) <= 0) tempErrors.amount = 'Valid loan amount is required';
    if (!income || parseFloat(income) <= 0) tempErrors.income = 'Valid annual income is required';
    if (!monthlyExpense || parseFloat(monthlyExpense) < 0) tempErrors.monthlyExpense = 'Monthly expense is required';
    if (!existingDebt || parseFloat(existingDebt) < 0) tempErrors.existingDebt = 'Existing debt balance is required';
    if (!purpose.trim() || purpose.trim().length < 5) tempErrors.purpose = 'Detailed purpose is required (min 5 chars)';
    if (creditScore < 300 || creditScore > 850) tempErrors.creditScore = 'Credit score must be between 300 and 850';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the validation errors.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/loan/apply', {
        loan_type: loanType,
        amount: parseFloat(amount),
        income: parseFloat(income),
        employment_status: employmentStatus,
        credit_score: parseInt(creditScore),
        monthly_expense: parseFloat(monthlyExpense),
        existing_debt: parseFloat(existingDebt),
        purpose: purpose
      });

      showToast('Loan applied successfully! AI Assessment generated.', 'success');
      navigate(`/prediction-result/${response.data.id}`);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Application filing failed.';
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Apply for Relief Loan</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fill out your financial details to trigger the rule-based AI eligibility evaluation.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem' }}>
        {/* Application Form */}
        <div className="card">
          <h3 className="card-title">
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            Application Profile
          </h3>
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="loanType">Relief Loan Type</label>
                <select 
                  id="loanType"
                  className="form-select"
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                >
                  <option value="Debt Consolidation">Debt Consolidation</option>
                  <option value="Credit Card Relief">Credit Card Relief</option>
                  <option value="Personal">Personal Loan</option>
                  <option value="Student Debt Refinance">Student Debt Refinance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="amount">Requested Amount ($)</label>
                <input 
                  id="amount"
                  type="number"
                  className="form-input"
                  placeholder="10000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                {errors.amount && <div className="form-error">{errors.amount}</div>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="income">Annual Income ($)</label>
                <input 
                  id="income"
                  type="number"
                  className="form-input"
                  placeholder="60000"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                />
                {errors.income && <div className="form-error">{errors.income}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="employmentStatus">Employment Status</label>
                <select 
                  id="employmentStatus"
                  className="form-select"
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Retired">Retired</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="existingDebt">Total Existing Debt ($)</label>
                <input 
                  id="existingDebt"
                  type="number"
                  className="form-input"
                  placeholder="5000"
                  value={existingDebt}
                  onChange={(e) => setExistingDebt(e.target.value)}
                />
                {errors.existingDebt && <div className="form-error">{errors.existingDebt}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="monthlyExpense">Monthly Living Expenses ($)</label>
                <input 
                  id="monthlyExpense"
                  type="number"
                  className="form-input"
                  placeholder="1500"
                  value={monthlyExpense}
                  onChange={(e) => setMonthlyExpense(e.target.value)}
                />
                {errors.monthlyExpense && <div className="form-error">{errors.monthlyExpense}</div>}
              </div>
            </div>

            {/* Premium Synchronized Slider for Credit Score */}
            <div className="slider-group mt-1">
              <div className="slider-header">
                <label className="form-label" htmlFor="creditScore">Credit Score</label>
                <span style={{ fontWeight: '700', color: creditScore >= 700 ? 'var(--success)' : creditScore >= 600 ? 'var(--warning)' : 'var(--danger)' }}>
                  {creditScore}
                </span>
              </div>
              <input 
                id="creditScore"
                type="range"
                min="300"
                max="850"
                className="slider"
                value={creditScore}
                onChange={(e) => setCreditScore(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Poor (300)</span>
                <span>Fair (600)</span>
                <span>Good (700)</span>
                <span>Excellent (850)</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="purpose">Purpose of Loan</label>
              <textarea 
                id="purpose"
                className="form-input"
                rows="3"
                placeholder="Consolidating high-interest credit card debt into a single manageable payment..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{ resize: 'vertical' }}
              />
              {errors.purpose && <div className="form-error">{errors.purpose}</div>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? 'Processing Application & Running AI...' : 'Submit & Check Eligibility'}
            </button>
          </form>
        </div>

        {/* Real-time Indicator Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <h4 style={{ fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} />
              Real-time Debt Indicators
            </h4>
            
            {/* DTI Indicator Card */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Debt-to-Income (DTI)</span>
                <span style={{ fontWeight: '700', color: dti > 60 ? 'var(--danger)' : dti > 40 ? 'var(--warning)' : 'var(--success)' }}>
                  {dti.toFixed(1)}%
                </span>
              </div>
              <div style={{ height: '8px', backgroundColor: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(100, dti)}%`, 
                  backgroundColor: dti > 60 ? 'var(--danger)' : dti > 40 ? 'var(--warning)' : 'var(--success)',
                  transition: 'width 0.3s ease' 
                }}></div>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                *DTI is computed by dividing your estimated monthly debt commitments (including 3% of your total balance) by monthly income. Target keeping DTI below 40% for optimal approval chances.
              </p>
            </div>

            {/* Overrides / Alert warnings */}
            {dti > 75 && (
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Automatic Rejection Warning: DTI exceeds the safety threshold of 75%.</span>
              </div>
            )}

            {creditScore < 500 && (
              <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.8rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Automatic Rejection Warning: Credit scores below 500 trigger automatic disapproval on this platform.</span>
              </div>
            )}
          </div>

          <div className="card" style={{ backgroundColor: 'rgba(14, 165, 233, 0.05)', borderColor: 'var(--border-active)' }}>
            <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={16} style={{ color: 'var(--primary)' }} />
              How AI Prediction Works
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.5' }}>
              Our rule-based engine tests your inputs against standard underwriting rules. It considers your credit rating tier, credit utilisation estimates, employment type stability, and Debt-to-Income safety zones. It returns a risk profile and custom recommendation to support your financial recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;
