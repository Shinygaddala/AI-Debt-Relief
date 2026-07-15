import React from 'react';
import { ShieldCheck, Info, HelpCircle, PhoneCall, AlertTriangle, BookOpen } from 'lucide-react';

const KnowYourRights = () => {
  return (
    <div className="page-container" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Know Your Rights</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Educate yourself on federal consumer protection acts and guard yourself against abusive debt collectors.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* FDCPA Guide */}
        <div className="card">
          <h3 className="card-title text-success" style={{ borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
            <ShieldCheck size={24} />
            Fair Debt Collection Practices Act (FDCPA)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '1rem', marginBottom: '1.5rem' }}>
            The FDCPA is a federal law that limits what third-party debt collectors can do when collecting a debt. It applies to personal credit cards, auto loans, medical bills, mortgages, and consumer debts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.03)', border: '1px solid rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--danger)', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={16} />
                Strict Prohibitions
              </h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Abusive Call Hours:</strong> Collectors cannot contact you before 8:00 AM or after 9:00 PM local time.</li>
                <li><strong>Workplace Harassment:</strong> If you notify them in writing that calls at work are prohibited, they must cease.</li>
                <li><strong>Coworkers and Family:</strong> Collectors cannot discuss your debt with third parties, coworkers, or neighbors.</li>
                <li><strong>Threats and Lies:</strong> Threatening arrest, falsely claiming to be law enforcement, or using abusive language is strictly illegal.</li>
              </ul>
            </div>

            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.03)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <h4 style={{ color: 'var(--success)', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={16} />
                Your Empowered Actions
              </h4>
              <ul style={{ listStyleType: 'disc', paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li><strong>Validation Request:</strong> Within 30 days of initial contact, you have the right to request written validation of the debt.</li>
                <li><strong>Dispute Rights:</strong> If you dispute the debt in writing, the collector must pause collection efforts until validation is provided.</li>
                <li><strong>Cease Communications:</strong> You have the right to write a letter demanding they stop calling you altogether.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FCRA Guide */}
        <div className="card">
          <h3 className="card-title text-success" style={{ borderBottom: '1px solid var(--border-glow)', paddingBottom: '0.75rem' }}>
            <BookOpen size={24} />
            Fair Credit Reporting Act (FCRA)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginTop: '1rem', marginBottom: '1rem' }}>
            The FCRA protects the accuracy, fairness, and privacy of information in your consumer credit files.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <strong>1. Credit Report Disputes:</strong> If a credit bureau lists inaccurate or outdated data, you have the right to dispute it directly. The credit bureau has 30 days to investigate.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <strong>2. Obsolete Data Removals:</strong> Negative credit information (late payments, collections) must be removed after 7 years. Chapter 7 bankruptcies must be removed after 10 years.
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.03)' }}>
              <strong>3. Access Limits:</strong> Only entities with a legitimate business need (landlords, employers, underwriters) can request access to your credit score.
            </div>
          </div>
        </div>

        {/* Action Strategy tips */}
        <div className="card" style={{ backgroundColor: 'rgba(14, 165, 233, 0.03)', borderColor: 'var(--border-active)' }}>
          <h3 className="card-title" style={{ color: 'var(--primary)' }}>
            <Info size={24} />
            Rule of Thumb Debt Collection Rules
          </h3>
          <ol style={{ paddingLeft: '1.25rem', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.75rem', lineHeight: '1.5' }}>
            <li><strong>Always Get It In Writing:</strong> Never make a settlement payment based on a verbal agreement. Demand a formal settlement letter stating the account is settled in full upon payment of the agreed amount.</li>
            <li><strong>Avoid Giving Bank Access:</strong> Do not give debt collectors electronic access to your main checking accounts. Pay via bank cashier's checks or separate prepaid cards.</li>
            <li><strong>Check Statutes of Limitations:</strong> Every state has a legal time limit beyond which creditors cannot sue you to collect a debt. Research your state laws before making any payments (making a partial payment can restart the clock).</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default KnowYourRights;
