import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { 
  DollarSign, 
  CheckCircle, 
  Clock, 
  AlertOctagon, 
  ArrowRight,
  TrendingUp,
  Brain
} from 'lucide-react';

// Register Chart.js dependencies
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/loan/my-loans');
      setLoans(response.data);
    } catch (err) {
      showToast('Failed to retrieve dashboard records.', 'error');
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

  // Aggregate Metrics
  const totalLoans = loans.length;
  const approvedLoans = loans.filter(l => l.status === 'APPROVED').length;
  const pendingLoans = loans.filter(l => l.status === 'PENDING').length;
  const rejectedLoans = loans.filter(l => l.status === 'REJECTED').length;
  
  const totalAmount = loans.reduce((acc, curr) => acc + curr.amount, 0);
  
  // Risk aggregation from loan predictions
  const riskCounts = { Eligible: 0, 'Moderate Risk': 0, 'High Risk': 0, Rejected: 0 };
  loans.forEach(l => {
    if (l.ai_prediction) {
      try {
        const pred = JSON.parse(l.ai_prediction);
        const key = pred.prediction;
        if (riskCounts[key] !== undefined) {
          riskCounts[key]++;
        }
      } catch (e) {
        // Fallback if parsing fails
      }
    }
  });

  // Latest loan assessment
  const latestLoan = loans[0];
  let latestPrediction = null;
  if (latestLoan?.ai_prediction) {
    try {
      latestPrediction = JSON.parse(latestLoan.ai_prediction);
    } catch (e) {}
  }

  // Chart 1: Loan Status Distribution
  const statusChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [approvedLoans, pendingLoans, rejectedLoans],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['rgba(16, 185, 129, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(239, 68, 68, 0.2)'],
        borderWidth: 1,
      },
    ],
  };

  // Chart 2: AI Risk Profile
  const riskChartData = {
    labels: ['Eligible', 'Moderate Risk', 'High Risk', 'Rejected'],
    datasets: [
      {
        label: 'Applications count',
        data: [riskCounts.Eligible, riskCounts['Moderate Risk'], riskCounts['High Risk'], riskCounts.Rejected],
        backgroundColor: ['rgba(16, 185, 129, 0.75)', 'rgba(245, 158, 11, 0.75)', 'rgba(239, 68, 68, 0.75)', 'rgba(220, 38, 38, 0.85)'],
        borderColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
        borderWidth: 1.5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#94a3b8' }
      }
    },
    scales: {
      y: {
        ticks: { color: '#94a3b8', precision: 0 },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      },
      x: {
        ticks: { color: '#94a3b8' },
        grid: { color: 'rgba(255, 255, 255, 0.05)' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#94a3b8', padding: 15 }
      }
    }
  };

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Financial Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Overview of your recovery applications and risk indicators</p>
        </div>
        <Link to="/loan/apply" className="btn btn-primary">
          Apply For Relief Loan <ArrowRight size={16} />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="dashboard-grid">
        <div className="card metric-card">
          <div className="metric-header">
            <span>Total Applied Value</span>
            <DollarSign size={18} className="text-secondary" />
          </div>
          <div className="metric-value">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className="metric-desc">Capital requested across {totalLoans} applications</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span>Approved Applications</span>
            <CheckCircle size={18} style={{ color: 'var(--success)' }} />
          </div>
          <div className="metric-value text-success">{approvedLoans}</div>
          <div className="metric-desc">Debt consolidation offers finalized</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span>Pending Evaluation</span>
            <Clock size={18} style={{ color: 'var(--warning)' }} />
          </div>
          <div className="metric-value text-warning">{pendingLoans}</div>
          <div className="metric-desc">Underwriters reviewing credit profiles</div>
        </div>

        <div className="card metric-card">
          <div className="metric-header">
            <span>Rejected / High Risk</span>
            <AlertOctagon size={18} style={{ color: 'var(--danger)' }} />
          </div>
          <div className="metric-value text-danger">{rejectedLoans}</div>
          <div className="metric-desc">Applications requiring recovery plans</div>
        </div>
      </div>

      {/* Main Charts & Side AI Panel */}
      {totalLoans > 0 ? (
        <>
          <div className="charts-grid">
            <div className="card" style={{ height: '350px' }}>
              <h3 className="card-title">
                <TrendingUp size={18} />
                AI Risk Profile Distribution
              </h3>
              <div style={{ height: '260px', position: 'relative' }}>
                <Bar data={riskChartData} options={chartOptions} />
              </div>
            </div>

            <div className="card" style={{ height: '350px' }}>
              <h3 className="card-title">Status Breakdown</h3>
              <div style={{ height: '260px', position: 'relative' }}>
                <Doughnut data={statusChartData} options={doughnutOptions} />
              </div>
            </div>
          </div>

          {/* AI Recommendation Alert */}
          {latestPrediction && (
            <div className={`prediction-box ${latestPrediction.prediction.replace(' ', '-')}`} style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'rgba(14, 165, 233, 0.1)', color: 'var(--primary)' }}>
                  <Brain size={24} />
                </div>
                <div>
                  <h4 style={{ fontWeight: '700', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                    Latest AI Assessment: <span style={{ textDecoration: 'underline' }}>{latestPrediction.prediction}</span> (Risk Score: {latestPrediction.risk_score}%)
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                    <strong>Reason:</strong> {latestPrediction.reason}
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <strong>Advisory Actions:</strong> {latestPrediction.recommendation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity Table */}
          <div className="card">
            <h3 className="card-title">Recent Activity</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Relief Type</th>
                    <th>Capital Requested</th>
                    <th>Credit Rating</th>
                    <th>Filing Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.slice(0, 5).map((loan) => (
                    <tr key={loan.id}>
                      <td>#{loan.id}</td>
                      <td style={{ fontWeight: '500' }}>{loan.loan_type}</td>
                      <td>${loan.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{loan.credit_score}</td>
                      <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge badge-${loan.status.toLowerCase()}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/prediction-result/${loan.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                          Analysis
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <div style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <TrendingUp size={48} style={{ strokeWidth: 1.5 }} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>No Loan History Available</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            Get started by applying for your first debt relief loan. Our AI engine will inspect your application parameters immediately.
          </p>
          <Link to="/loan/apply" className="btn btn-primary">
            Submit First Application
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
