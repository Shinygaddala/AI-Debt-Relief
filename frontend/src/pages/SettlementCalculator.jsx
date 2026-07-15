import React, { useState } from 'react';
import { Calculator, ArrowRight, DollarSign, Calendar, Sparkles } from 'lucide-react';

const SettlementCalculator = () => {
  const [balance, setBalance] = useState('10000');
  const [settlePercent, setSettlePercent] = useState(40); // Default 40% offer
  const [months, setMonths] = useState(12); // Save over 12 months

  const parsedBalance = parseFloat(balance) || 0;
  const targetOffer = parsedBalance * (settlePercent / 100);
  const totalSavings = parsedBalance - targetOffer;
  const monthlySavings = targetOffer / months;

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Settlement Offering Planner</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Calculate target settlement amounts and monthly savings goals to request creditor write-offs.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Planner Inputs Card */}
        <div className="card">
          <h3 className="card-title">
            <Calculator size={20} style={{ color: 'var(--primary)' }} />
            Settlement Parameters
          </h3>
          <div style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="balance">Original Debt Balance ($)</label>
              <input 
                id="balance"
                type="number"
                className="form-input"
                placeholder="10000"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>

            {/* Slider for Settlement % */}
            <div className="slider-group">
              <div className="slider-header">
                <label className="form-label" htmlFor="settlePercent">Target Settlement Percentage</label>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                  {settlePercent}%
                </span>
              </div>
              <input 
                id="settlePercent"
                type="range"
                min="20"
                max="60"
                className="slider"
                value={settlePercent}
                onChange={(e) => setSettlePercent(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Aggressive (20%)</span>
                <span>Standard (40%)</span>
                <span>Conservative (60%)</span>
              </div>
            </div>

            {/* Slider for Saving Months */}
            <div className="slider-group">
              <div className="slider-header">
                <label className="form-label" htmlFor="months">Savings Accumulation Timeline</label>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                  {months} Months
                </span>
              </div>
              <input 
                id="months"
                type="range"
                min="3"
                max="36"
                className="slider"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value))}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <span>Quick (3m)</span>
                <span>1 Year (12m)</span>
                <span>3 Years (36m)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="card-title">
              <Sparkles size={20} style={{ color: 'var(--success)' }} />
              Savings & Offering Estimation
            </h3>
            
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Target Lump-Sum Offer</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                  ${targetOffer.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Estimated Balance Write-off (Savings)</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--success)' }}>
                  ${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({100 - settlePercent}% saved)
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Savings Required</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--warning)' }}>
                  ${monthlySavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mo
                </span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glow)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginTop: '1.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
            <strong>Strategic Tip:</strong> Creditors typically require a single lump-sum payment to settle. If you can save up the Target Offer of <strong>${targetOffer.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> by saving <strong>${monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong> per month for <strong>{months} months</strong>, you will be prepared to make a formal settlement offer. Use our Email Generator to draft the proposal.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettlementCalculator;
