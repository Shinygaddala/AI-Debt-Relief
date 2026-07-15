import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Calculator, 
  Mail, 
  ArrowRight, 
  Sparkles 
} from 'lucide-react';

const LandingPage = () => {
  const token = localStorage.getItem('access_token');

  return (
    <div className="landing-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header className="navbar" style={{ position: 'relative', borderBottom: '1px solid var(--border-glow)' }}>
        <div style={{ fontWeight: '800', fontSize: '1.25rem', color: '#fff' }}>
          AI Powered Debt Relief
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {token ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Register</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            backgroundColor: 'rgba(14, 165, 233, 0.1)', 
            border: '1px solid var(--border-active)', 
            padding: '0.5rem 1rem', 
            borderRadius: '50px',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '2rem'
          }}>
            <Sparkles size={16} />
            <span>AI-Driven Financial Recovery Engine</span>
          </div>
          <h1 className="landing-title">
            Take Control of Your Debt <br />
            with Advanced AI Analysis
          </h1>
          <p className="landing-subtitle">
            Evaluate loan eligibility, run risk predictions, calculate debt payoff schedules, and generate formal creditor hardship communications—all in one secure platform.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {token ? (
              <Link to="/dashboard" className="btn btn-primary">
                Return to Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Start Your Journey <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '3rem', fontWeight: '700' }}>
          Intelligent Tools Built for Financial Freedom
        </h2>
        <div className="landing-features">
          <div className="card">
            <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}>
              <BrainCircuit size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Rule-Based AI Engine</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Our proprietary financial algorithm predicts eligibility instantly, computing debt-to-income limits and providing tailored advice.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--success)', marginBottom: '1rem' }}>
              <Calculator size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Settlement Calculator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Evaluate current outstanding balances and determine recommended lump-sum settlement offers to negotiate debt write-offs.
            </p>
          </div>

          <div className="card">
            <div style={{ color: 'var(--warning)', marginBottom: '1rem' }}>
              <Mail size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Hardship Letter Generator</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Create legally-mindful, structured negotiation emails and cease-and-desist warnings to stop creditor harassment.
            </p>
          </div>

          <div className="card">
            <div style={{ color: '#a855f7', marginBottom: '1rem' }}>
              <ShieldAlert size={40} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Know Your Rights</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Educate yourself on the Fair Debt Collection Practices Act (FDCPA) and guard yourself against unethical collectors.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glow)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} AI Powered Debt Relief & Financial Recovery Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
