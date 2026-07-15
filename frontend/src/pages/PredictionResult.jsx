import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { 
  BrainCircuit, 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ShieldCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

const PredictionResult = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchLoanDetails();
  }, [id]);

  const fetchLoanDetails = async () => {
    try {
      const response = await api.get(`/loan/${id}`);
      setLoan(response.data);
      if (response.data.ai_prediction) {
        setPrediction(JSON.parse(response.data.ai_prediction));
      }
    } catch (err) {
      showToast('Failed to load application AI assessment details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="page-container text-center" style={{ padding: '4rem 2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Application Record Not Found</h3>
        <Link to="/loan/history" className="btn btn-primary">
          <ArrowLeft size={16} /> Return to History
        </Link>
      </div>
    );
  }

  const getPredictionIcon = (pred) => {
    switch (pred?.toLowerCase()) {
      case 'eligible':
        return <CheckCircle2 size={40} className="text-success" />;
      case 'moderate risk':
        return <AlertTriangle size={40} className="text-warning" />;
      case 'high risk':
        return <AlertTriangle size={40} style={{ color: '#f97316' }} />;
      default:
        return <XCircle size={40} className="text-danger" />;
    }
  };

  const getPredictionClass = (pred) => {
    switch (pred?.toLowerCase()) {
      case 'eligible':
        return 'Eligible';
      case 'moderate risk':
        return 'Moderate-Risk';
      case 'high risk':
        return 'High-Risk';
      default:
        return 'Rejected';
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/loan/history" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> Back to History
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>AI Underwriting Analysis</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Filing ID: #{loan.id} &bull; Generated on {new Date(loan.created_at).toLocaleString()}</p>
      </div>

      {prediction ? (
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }}>
          {/* AI Result Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className={`card prediction-box ${getPredictionClass(prediction.prediction)}`} style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                {getPredictionIcon(prediction.prediction)}
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                    Filing Verdict
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: '800', lineHeight: 1 }}>
                    {prediction.prediction}
                  </h2>
                </div>
              </div>

              {/* Progress bars for Risk and Confidence */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>AI Credit Risk Score</span>
                    <span style={{ fontWeight: '700' }}>{prediction.risk_score}%</span>
                  </div>
                  <div className="risk-bar-container">
                    <div 
                      className="risk-bar" 
                      style={{ 
                        width: `${prediction.risk_score}%`, 
                        backgroundColor: prediction.risk_score >= 70 ? 'var(--danger)' : prediction.risk_score >= 40 ? 'var(--warning)' : 'var(--success)' 
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Underwriting Confidence</span>
                    <span style={{ fontWeight: '700' }}>{prediction.confidence}%</span>
                  </div>
                  <div className="risk-bar-container">
                    <div 
                      className="risk-bar" 
                      style={{ 
                        width: `${prediction.confidence}%`, 
                        backgroundColor: 'var(--primary)' 
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Factors */}
              <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={16} />
                  Primary Underwriting Factors
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {prediction.reason.split(' | ').map((reason, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      gap: '0.5rem', 
                      fontSize: '0.875rem', 
                      backgroundColor: 'rgba(255, 255, 255, 0.02)', 
                      padding: '0.6rem 0.75rem', 
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid rgba(255,255,255,0.03)' 
                    }}>
                      <span style={{ color: reason.includes('Critical') || reason.includes('Rejection') ? 'var(--danger)' : reason.includes('Warning') ? 'var(--warning)' : 'var(--success)', fontWeight: 'bold' }}>&bull;</span>
                      <span style={{ color: 'var(--text-secondary)' }}>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '1.5rem' }}>
                <h4 style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} />
                  Advisory Recovery Plan
                </h4>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {prediction.recommendation.split('. ').map((item, idx) => (
                    item.trim() && (
                      <div key={idx} style={{ marginBottom: '0.5rem' }}>
                        {item.includes('1.') || item.includes('2.') || item.includes('3.') ? (
                          <div style={{ fontWeight: '500', color: 'var(--text-primary)' }}>{item}</div>
                        ) : (
                          <div>{item}</div>
                        )}
                      </div>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions Router */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link to="/calculator/settlement" className="card text-center" style={{ padding: '1.25rem' }}>
                <h5 style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '0.25rem' }}>Settlement Planner</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Map out 40-50% savings settlement offerings</p>
              </Link>
              <Link to="/negotiation" className="card text-center" style={{ padding: '1.25rem' }}>
                <h5 style={{ fontWeight: '600', color: 'var(--primary)', marginBottom: '0.25rem' }}>Hardship Email Generator</h5>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate formal letter formats for creditors</p>
              </Link>
            </div>
          </div>

          {/* Submission Parameters summary */}
          <div className="card" style={{ height: 'fit-content' }}>
            <h3 className="card-title">Filing Profile Inputs</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Loan Relief Category</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{loan.loan_type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Requested Capital</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Annual Income</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>${loan.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Employment Classification</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{loan.employment_status}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>FICO Credit Rating</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{loan.credit_score}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Monthly Living Cost</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>${loan.monthly_expense.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Existing Debt Balance</span>
                <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>${loan.existing_debt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Applicant Purpose</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: '1.4', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  {loan.purpose}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '3rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>No AI prediction data stored for this application.</h3>
        </div>
      )}
    </div>
  );
};

export default PredictionResult;
