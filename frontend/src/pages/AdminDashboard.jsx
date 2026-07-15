import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Line, Pie } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Check, 
  X, 
  Eye, 
  Trash2, 
  Sparkles,
  Database
} from 'lucide-react';

// Register ChartJS elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [subTab, setSubTab] = useState('stats'); // stats, loans, users
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await api.get('/admin/stats');
      const usersRes = await api.get('/admin/users');
      const loansRes = await api.get('/admin/loans');
      
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      showToast('Unauthorized access or session expired.', 'error');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLoanStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/loan/${id}`, { status });
      showToast(`Loan application status updated to ${status}.`, 'success');
      
      // Update local state
      setLoans(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      
      // Re-fetch stats
      const statsRes = await api.get('/admin/stats');
      setStats(statsRes.data);
    } catch (err) {
      showToast('Failed to update loan status.', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('User account and history successfully purged.', 'success');
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteConfirmUser(null);
      
      // Re-fetch stats and loans
      const statsRes = await api.get('/admin/stats');
      const loansRes = await api.get('/admin/loans');
      setStats(statsRes.data);
      setLoans(loansRes.data);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Purge failed.';
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

  // Chart 1: Credit Risk Profile Distribution
  const riskLabels = stats ? Object.keys(stats.risk_distribution) : [];
  const riskData = stats ? Object.values(stats.risk_distribution) : [];
  const riskChartData = {
    labels: riskLabels,
    datasets: [
      {
        data: riskData,
        backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(245, 158, 11, 0.75)', 'rgba(239, 68, 68, 0.75)', 'rgba(220, 38, 38, 0.85)'],
        borderColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: Monthly Filings Trend
  const trendLabels = stats ? Object.keys(stats.monthly_trend) : [];
  const trendData = stats ? Object.values(stats.monthly_trend) : [];
  const trendChartData = {
    labels: trendLabels,
    datasets: [
      {
        label: 'Loan Applications',
        data: trendData,
        fill: true,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#0284c7'
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { ticks: { color: '#94a3b8', precision: 0 }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } }
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Admin Control Center</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>System status, applications underwriting, and user account management.</p>
      </div>

      {/* Navigation Subtabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glow)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setSubTab('stats')}
          className={`btn ${subTab === 'stats' ? 'btn-primary' : 'btn-secondary'}`}
        >
          System Overview
        </button>
        <button 
          onClick={() => setSubTab('loans')}
          className={`btn ${subTab === 'loans' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Manage Relief Applications ({loans.length})
        </button>
        <button 
          onClick={() => setSubTab('users')}
          className={`btn ${subTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Manage Users ({users.length})
        </button>
      </div>

      {/* 1. OVERVIEW VIEW */}
      {subTab === 'stats' && stats && (
        <>
          {/* KPI Metrics */}
          <div className="dashboard-grid">
            <div className="card metric-card">
              <div className="metric-header">
                <span>Active Users</span>
                <Users size={18} className="text-secondary" />
              </div>
              <div className="metric-value">{stats.total_users}</div>
              <div className="metric-desc">Registered recovery applicants</div>
            </div>

            <div className="card metric-card">
              <div className="metric-header">
                <span>Relief Filings</span>
                <FileText size={18} className="text-secondary" />
              </div>
              <div className="metric-value">{stats.total_loans}</div>
              <div className="metric-desc">Total applications under review</div>
            </div>

            <div className="card metric-card">
              <div className="metric-header">
                <span>Requested Capital</span>
                <DollarSign size={18} className="text-secondary" />
              </div>
              <div className="metric-value">
                ${stats.total_requested_capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="metric-desc">Platform requested liability total</div>
            </div>

            <div className="card metric-card">
              <div className="metric-header">
                <span>Approved Capital</span>
                <DollarSign size={18} style={{ color: 'var(--success)' }} />
              </div>
              <div className="metric-value text-success">
                ${stats.approved_capital.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="metric-desc">Consolidation loans finalized</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            <div className="card" style={{ height: '350px' }}>
              <h3 className="card-title">
                <TrendingUp size={18} />
                Monthly Applications Activity
              </h3>
              <div style={{ height: '260px', position: 'relative' }}>
                {trendLabels.length > 0 ? (
                  <Line data={trendChartData} options={trendOptions} />
                ) : (
                  <div style={{ textAlign: 'center', paddingTop: '5rem', color: 'var(--text-muted)' }}>No filings trend available.</div>
                )}
              </div>
            </div>

            <div className="card" style={{ height: '350px' }}>
              <h3 className="card-title">Credit Risk Share</h3>
              <div style={{ height: '260px', position: 'relative' }}>
                {riskData.some(v => v > 0) ? (
                  <Pie data={riskChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }} />
                ) : (
                  <div style={{ textAlign: 'center', paddingTop: '5rem', color: 'var(--text-muted)' }}>No risk predictions run yet.</div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 2. LOANS VIEW */}
      {subTab === 'loans' && (
        <div className="card">
          <h3 className="card-title">Relief Applications Log</h3>
          {loans.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Filing ID</th>
                    <th>User ID</th>
                    <th>Relief Type</th>
                    <th>Requested Capital</th>
                    <th>FICO Rating</th>
                    <th>Filing Date</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.map((loan) => (
                    <tr key={loan.id}>
                      <td>#{loan.id}</td>
                      <td>User #{loan.user_id}</td>
                      <td style={{ fontWeight: '600' }}>{loan.loan_type}</td>
                      <td>${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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
                            style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                            title="Inspect Underwriting Details"
                          >
                            <Eye size={13} />
                          </Link>
                          
                          {loan.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => handleLoanStatus(loan.id, 'APPROVED')} 
                                className="btn btn-primary"
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem', backgroundColor: 'var(--success)' }}
                                disabled={actionLoading}
                                title="Approve Loan"
                              >
                                <Check size={13} />
                              </button>
                              <button 
                                onClick={() => handleLoanStatus(loan.id, 'REJECTED')} 
                                className="btn btn-danger"
                                style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                                disabled={actionLoading}
                                title="Reject Loan"
                              >
                                <X size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              No loan applications have been submitted.
            </div>
          )}
        </div>
      )}

      {/* 3. USERS VIEW */}
      {subTab === 'users' && (
        <div className="card">
          <h3 className="card-title">Registered Accounts Log</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>System Role</th>
                  <th>Joined Date</th>
                  <th style={{ textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'Not provided'}</td>
                    <td>
                      <span className={`badge ${user.role === 'ADMIN' ? 'badge-approved' : 'badge-pending'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        onClick={() => setDeleteConfirmUser(user)} 
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.6rem', fontSize: '0.75rem' }}
                        title="Delete User Account"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Delete Confirmation Modal */}
      {deleteConfirmUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
                <ShieldAlert size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Purge User Account?</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Are you sure you want to permanently delete user <strong>{deleteConfirmUser.name}</strong> ({deleteConfirmUser.email})? 
                  This will purge their complete profile, application history, and AI runs from the database.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => setDeleteConfirmUser(null)} 
                    className="btn btn-secondary"
                  >
                    Keep Account
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(deleteConfirmUser.id)} 
                    className="btn btn-danger"
                  >
                    Purge Records
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

export default AdminDashboard;
