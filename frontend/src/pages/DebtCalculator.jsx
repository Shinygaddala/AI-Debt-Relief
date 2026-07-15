import React, { useState } from 'react';
import { Calculator, Plus, Trash2, ShieldAlert, Sparkles, TrendingDown, BookOpen } from 'lucide-react';

const DebtCalculator = () => {
  const [activeTab, setActiveTab] = useState('payoff'); // payoff or emi
  
  // EMI Calculator State
  const [emiAmount, setEmiAmount] = useState('10000');
  const [emiRate, setEmiRate] = useState(9.5);
  const [emiTenure, setEmiTenure] = useState(36);

  // Payoff Strategy State
  const [debts, setDebts] = useState([
    { id: 1, name: 'Credit Card A', balance: 3000, rate: 22.9, minPay: 90 },
    { id: 2, name: 'Personal Loan', balance: 8000, rate: 10.5, minPay: 220 },
    { id: 3, name: 'Medical Debt', balance: 1500, rate: 0.0, minPay: 50 },
  ]);
  const [extraPayment, setExtraPayment] = useState('200');
  const [debtName, setDebtName] = useState('');
  const [debtBalance, setDebtNameBalance] = useState('');
  const [debtRate, setDebtNameRate] = useState('');
  const [debtMinPay, setDebtNameMinPay] = useState('');

  // Handle adding new debt
  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!debtName || !debtBalance || !debtMinPay) return;
    
    const newDebt = {
      id: Date.now(),
      name: debtName,
      balance: parseFloat(debtBalance),
      rate: parseFloat(debtRate) || 0,
      minPay: parseFloat(debtMinPay)
    };
    
    setDebts([...debts, newDebt]);
    setDebtName('');
    setDebtNameBalance('');
    setDebtNameRate('');
    setDebtNameMinPay('');
  };

  // Remove debt
  const handleRemoveDebt = (id) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  // Payoff Strategy Logic
  const runPayoffAnalysis = () => {
    if (debts.length === 0) return null;
    
    const extra = parseFloat(extraPayment) || 0;
    
    // Sort debts for Snowball: Smallest balance first
    const snowballOrder = [...debts].sort((a, b) => a.balance - b.balance);
    
    // Sort debts for Avalanche: Highest interest rate first
    const avalancheOrder = [...debts].sort((a, b) => b.rate - a.rate);

    // Helper to simulate payoff timeline
    const simulate = (order) => {
      let currentDebts = order.map(d => ({ ...d, currentBalance: d.balance }));
      let totalMonths = 0;
      let totalInterestPaid = 0;
      let history = [];

      while (currentDebts.some(d => d.currentBalance > 0) && totalMonths < 360) { // limit 30 years
        totalMonths++;
        let availablePool = extra;
        
        // Sum minimum payments for active debts
        const minPayPool = currentDebts.reduce((sum, d) => d.currentBalance > 0 ? sum + d.minPay : sum, 0);
        let totalMonthlyBudget = minPayPool + extra;
        
        // Apply monthly interest first
        currentDebts = currentDebts.map(d => {
          if (d.currentBalance <= 0) return d;
          const monthlyRate = (d.rate / 100) / 12;
          const interest = d.currentBalance * monthlyRate;
          totalInterestPaid += interest;
          return { ...d, currentBalance: d.currentBalance + interest };
        });

        // Pay minimums first
        currentDebts = currentDebts.map(d => {
          if (d.currentBalance <= 0) return d;
          const payment = Math.min(d.currentBalance, d.minPay);
          totalMonthlyBudget -= payment;
          return { ...d, currentBalance: d.currentBalance - payment };
        });

        // Allocate remaining extra budget to the target debt (first active in order)
        for (let d of currentDebts) {
          if (d.currentBalance > 0) {
            const extraApplied = Math.min(d.currentBalance, totalMonthlyBudget);
            d.currentBalance -= extraApplied;
            totalMonthlyBudget -= extraApplied;
            if (totalMonthlyBudget <= 0) break;
          }
        }
      }

      return { months: totalMonths, interest: totalInterestPaid };
    };

    const snowballResult = simulate(snowballOrder);
    const avalancheResult = simulate(avalancheOrder);

    return {
      snowball: { order: snowballOrder, ...snowballResult },
      avalanche: { order: avalancheOrder, ...avalancheResult }
    };
  };

  const payoffAnalysis = runPayoffAnalysis();

  // EMI Calculator Calculation
  const calculateEMI = () => {
    const P = parseFloat(emiAmount) || 0;
    const r = (parseFloat(emiRate) / 12) / 100;
    const n = parseInt(emiTenure) || 0;

    if (P <= 0 || r < 0 || n <= 0) return { emi: 0, interest: 0, total: 0 };
    
    let emi = 0;
    if (r === 0) {
      emi = P / n;
    } else {
      emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const total = emi * n;
    const interest = total - P;

    return { emi, interest, total };
  };

  const emiResult = calculateEMI();

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Debt & EMI Planners</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Compare payoff methods or calculate monthly payments for debt consolidation loans.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glow)', paddingBottom: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('payoff')}
          className={`btn ${activeTab === 'payoff' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Debt Payoff Strategy (Snowball vs Avalanche)
        </button>
        <button 
          onClick={() => setActiveTab('emi')}
          className={`btn ${activeTab === 'emi' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Consolidation EMI Calculator
        </button>
      </div>

      {/* Tab Content 1: Payoff strategy */}
      {activeTab === 'payoff' && (
        <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Add Debts form */}
            <div className="card">
              <h3 className="card-title">Active Debts List</h3>
              <form onSubmit={handleAddDebt} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem', marginTop: '1rem', alignItems: 'flex-end' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Debt Name</label>
                  <input type="text" className="form-input" placeholder="e.g. Card A" value={debtName} onChange={(e) => setDebtName(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Balance ($)</label>
                  <input type="number" className="form-input" placeholder="3000" value={debtBalance} onChange={(e) => setDebtNameBalance(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">APR (%)</label>
                  <input type="number" step="0.1" className="form-input" placeholder="18.9" value={debtRate} onChange={(e) => setDebtNameRate(e.target.value)} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Min Pay ($)</label>
                  <input type="number" className="form-input" placeholder="75" value={debtMinPay} onChange={(e) => setDebtNameMinPay(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '42px', padding: '0 1rem' }}>
                  <Plus size={18} /> Add
                </button>
              </form>

              {/* Debts Table */}
              <div className="table-container" style={{ marginTop: '1.5rem' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Debt Name</th>
                      <th>Balance</th>
                      <th>APR %</th>
                      <th>Min Monthly</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debts.map((d) => (
                      <tr key={d.id}>
                        <td style={{ fontWeight: '600' }}>{d.name}</td>
                        <td>${d.balance.toLocaleString()}</td>
                        <td>{d.rate}%</td>
                        <td>${d.minPay}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button onClick={() => handleRemoveDebt(d.id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.5rem', borderColor: 'var(--danger-glow)' }}>
                            <Trash2 size={14} className="text-danger" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Strategy Comparison Results */}
            <div className="card">
              <h3 className="card-title">Payoff Analysis</h3>
              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-label" htmlFor="extraPayment">Extra Monthly Payment Budget ($)</label>
                <input 
                  id="extraPayment"
                  type="number"
                  className="form-input"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                  placeholder="200"
                />
              </div>

              {payoffAnalysis ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                  {/* Snowball Results */}
                  <div style={{ borderBottom: '1px solid var(--border-glow)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justify: 'between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>1. Debt Snowball Method</span>
                      <span className="badge badge-pending">Psychological Win</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem' }}>
                      Focuses on eliminating smallest balance first.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Debt-Free Timeline</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{payoffAnalysis.snowball.months} Months</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Interest Paid</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                          ${payoffAnalysis.snowball.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Avalanche Results */}
                  <div>
                    <div style={{ display: 'flex', justify: 'between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '1rem' }}>2. Debt Avalanche Method</span>
                      <span className="badge badge-approved">Mathematical Best</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0.5rem' }}>
                      Focuses on paying down highest interest rate (APR) first.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Debt-Free Timeline</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)' }}>{payoffAnalysis.avalanche.months} Months</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Interest Paid</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }}>
                          ${payoffAnalysis.avalanche.interest.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                  Add active debts to compare strategies.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: EMI Calculator */}
      {activeTab === 'emi' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Inputs Card */}
          <div className="card">
            <h3 className="card-title">
              <Calculator size={20} style={{ color: 'var(--primary)' }} />
              Loan Specifications
            </h3>
            <div style={{ marginTop: '1.5rem' }}>
              {/* Slider for Amount */}
              <div className="slider-group">
                <div className="slider-header">
                  <label className="form-label" htmlFor="emiAmount">Loan Capital Amount</label>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    ${parseInt(emiAmount).toLocaleString()}
                  </span>
                </div>
                <input 
                  id="emiAmount"
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  className="slider"
                  value={emiAmount}
                  onChange={(e) => setEmiAmount(e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>$2,000</span>
                  <span>$50,000</span>
                  <span>$100,000</span>
                </div>
              </div>

              {/* Slider for Interest Rate */}
              <div className="slider-group">
                <div className="slider-header">
                  <label className="form-label" htmlFor="emiRate">Annual Interest Rate (APR %)</label>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    {emiRate}%
                  </span>
                </div>
                <input 
                  id="emiRate"
                  type="range"
                  min="3.0"
                  max="30.0"
                  step="0.1"
                  className="slider"
                  value={emiRate}
                  onChange={(e) => setEmiRate(parseFloat(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>3.0%</span>
                  <span>15.0%</span>
                  <span>30.0%</span>
                </div>
              </div>

              {/* Slider for Tenure */}
              <div className="slider-group">
                <div className="slider-header">
                  <label className="form-label" htmlFor="emiTenure">Loan Term Duration (Tenure)</label>
                  <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                    {emiTenure} Months
                  </span>
                </div>
                <input 
                  id="emiTenure"
                  type="range"
                  min="12"
                  max="84"
                  step="6"
                  className="slider"
                  value={emiTenure}
                  onChange={(e) => setEmiTenure(parseInt(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  <span>1 Year (12m)</span>
                  <span>4 Years (48m)</span>
                  <span>7 Years (84m)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="card-title">
                <Sparkles size={20} style={{ color: 'var(--success)' }} />
                Monthly EMI Calculations
              </h3>
              
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Estimated Monthly Payment (EMI)</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                    ${emiResult.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Interest Payable</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--warning)' }}>
                    ${emiResult.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Total Repayment Value (Principal + Interest)</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    ${emiResult.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              <strong>Underwriting Disclaimer:</strong> This represents a standard mathematical estimation of a fixed-rate loan payoff. Actual approval amounts, interest rates, and fee assessments are determined by system administrators based on credit checks, active risk scores, and profile verification.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DebtCalculator;
