import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { History, Eye, Trash2, ShieldAlert } from 'lucide-react';

const LoanHistory = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/loan/my-loans');
      setLoans(response.data);
    } catch (err) {
      showToast('Failed to retrieve loan applications history.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/loan/${id}`);
      showToast('Application successfully canceled and removed.', 'success');
      setLoans((prev) => prev.filter((loan) => loan.id !== id));
      setDeleteConfirmId(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Cancellation failed.';
      showToast(errorMsg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Your Relief Applications</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track all current and past financial recovery loan filings.</p>
      </div>

      {loans.length > 0 ? (
        <div className="card">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filing ID</th>
                  <th>Relief Type</th>
                  <th>Amount Requested</th>
                  <th>Annual Income</th>
                  <th>Credit Rating</th>
                  <th>Filing Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id}>
                    <td>#{loan.id}</td>
                    <td style={{ fontWeight: '600' }}>{loan.loan_type}</td>
                    <td>${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>${loan.income.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td>{loan.credit_score}</td>
                    <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${loan.status.toLowerCase()}`}>
                        {loan.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link 
                          to={`/prediction-result/${loan.id}`} 
                          className="btn btn-secondary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          title="View AI prediction assessment"
                        >
                          <Eye size={14} />
                          <span>AI Assessment</span>
                        </Link>
                        
                        {loan.status === 'PENDING' && (
                          <button 
                            onClick={() => setDeleteConfirmId(loan.id)} 
                            className="btn btn-danger"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            title="Cancel Application"
                          >
                            <Trash2 size={14} />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <History size={48} style={{ strokeWidth: 1.5 }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Applications Filed</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            You haven't submitted any debt relief loan applications yet. Submit an application to get an assessment.
          </p>
          <Link to="/loan/apply" className="btn btn-primary">
            Apply Now
          </Link>
        </div>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Cancel Application?</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Are you sure you want to cancel and delete loan application #{deleteConfirmId}? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setDeleteConfirmId(null)} 
                    className="btn btn-secondary"
                  >
                    Keep Application
                  </button>
                  <button 
                    onClick={() => handleDelete(deleteConfirmId)} 
                    className="btn btn-danger"
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanHistory;
