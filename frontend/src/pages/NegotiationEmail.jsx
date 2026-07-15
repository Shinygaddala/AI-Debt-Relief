import React, { useState } from 'react';
import { useToast } from '../components/Toast';
import { Mail, Copy, Check, Sparkles } from 'lucide-react';

const NegotiationEmail = () => {
  const [template, setTemplate] = useState('hardship'); // hardship, settlement, cease
  const [creditorName, setCreditorName] = useState('First National Bank');
  const [accountNum, setAccountNum] = useState('1234');
  const [debtBalance, setDebtBalance] = useState('5000');
  const [hardshipReason, setHardshipReason] = useState('unemployment');
  const [proposedOffer, setProposedOffer] = useState('2000');
  const [proposedMonthly, setProposedMonthly] = useState('100');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const userName = localStorage.getItem('user_name') || 'John Doe';

  // Hardship Reason translations
  const reasonTextMap = {
    unemployment: 'unexpected loss of employment and active search for work',
    medical: 'severe medical emergencies and corresponding out-of-pocket healthcare costs',
    income_reduction: 'a substantial reduction in monthly household income and hours worked',
    natural_disaster: 'unexpected emergency relief costs affecting basic living budgets'
  };

  const generateLetter = () => {
    const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const reasonText = reasonTextMap[hardshipReason] || 'temporary economic distress';

    if (template === 'hardship') {
      return `Date: ${today}

To: Customer Assistance & Loss Mitigation Department
Creditor Name: ${creditorName}
Re: Debt Workout & Hardship Program Request
Account Number: XXXX-XXXX-XXXX-${accountNum}

Dear Account Administrator,

I am writing this letter to notify you that I am experiencing severe financial hardship due to ${reasonText}. Consequently, I am unable to maintain my standard monthly payments at this time.

I am fully committed to meeting my financial obligations, but I need immediate temporary assistance. I would like to request:
1. A temporary suspension or reduction of interest charges on my account.
2. A restructure of my payments to a temporary rate of $${proposedMonthly}/month for the next 6 months.
3. A waiver of any late fees or penalties during this recovery timeframe.

Enclosed (or available upon request) is documentation of my current income limits and monthly expenses. Please contact me at your earliest convenience to confirm if this workout plan is acceptable.

Thank you for your consideration and partnership.

Sincerely,

${userName}
Contact: Available on Account Profile`;
    }

    if (template === 'settlement') {
      return `Date: ${today}

To: Debt Settlements & Recoveries Department
Creditor Name: ${creditorName}
Re: Offer in Full & Final Settlement of Debt
Account Number: XXXX-XXXX-XXXX-${accountNum}
Current Outstanding Balance: $${parseFloat(debtBalance).toLocaleString()}

Dear Collections Representative,

I am writing to submit a formal settlement proposal regarding the outstanding balance on the account referenced above. Due to sustained financial hardship arising from ${reasonText}, I am unable to pay the balance in full.

I have evaluated my liquid resources and have managed to secure a lump-sum amount of $${parseFloat(proposedOffer).toLocaleString()} from a family member. I am offering this amount of $${parseFloat(proposedOffer).toLocaleString()} as a lump-sum payment in full and final settlement of this debt.

This offer is made on the condition that:
1. Upon receipt of this payment, the remaining balance will be fully written off and my account marked "Settled in Full" or "Paid in Full."
2. Your organization reports my account status to the major credit reporting bureaus as "Settled in Full" with a $0 balance.
3. All collections calls, correspondence, and third-party assignments stop immediately.

If this offer is acceptable, please send me a formal agreement letter in writing outlining these exact terms. Once I receive your written confirmation, I will execute the wire transfer or payment immediately.

Sincerely,

${userName}
Contact: Available on Account Profile`;
    }

    if (template === 'cease') {
      return `Date: ${today}

To: Collections and Legal Compliance Department
Creditor Name: ${creditorName}
Re: Cease and Desist Warning - Fair Debt Collection Practices Act (FDCPA)
Account Number: XXXX-XXXX-XXXX-${accountNum}

Dear Collectors,

I am writing to request that you immediately cease and desist all telephone communications regarding my account at my home, mobile numbers, and place of employment.

Under Section 805(c) of the Fair Debt Collection Practices Act (FDCPA), 15 U.S.C. § 1692c, you must cease all communication with me after receiving written notice of my request, with the exception of notifying me of specific legal actions.

Further, calling my workplace is causing severe issues with my employer and threatens my job stability. Please note that telephone communications at my place of work are strictly prohibited.

Any future communication regarding this account must be sent in writing via standard postal mail. Please confirm receipt of this cease and desist request in writing.

Thank you for your compliance.

Sincerely,

${userName}
Contact: Available on Account Profile`;
    }

    return '';
  };

  const handleCopy = () => {
    const text = generateLetter();
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Hardship letter template copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Negotiation Letter Generator</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Generate legally-compliant templates to send to creditors and negotiate debt restructuring.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '1.5rem' }}>
        {/* Form Configuration Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 className="card-title">
            <Mail size={20} style={{ color: 'var(--primary)' }} />
            Letter Customization
          </h3>

          <div style={{ marginTop: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="template">Letter Template Type</label>
              <select 
                id="template"
                className="form-select"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                <option value="hardship">Temporary Financial Hardship Request</option>
                <option value="settlement">Debt Settlement Proposal (Lump-Sum)</option>
                <option value="cease">Cease & Desist Phone Calls (FDCPA)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="creditorName">Creditor/Institution Name</label>
              <input 
                id="creditorName"
                type="text" 
                className="form-input" 
                value={creditorName}
                onChange={(e) => setCreditorName(e.target.value)}
                placeholder="e.g. First National Bank"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="accountNum">Account Number (Last 4 Digits)</label>
              <input 
                id="accountNum"
                type="text" 
                maxLength="4"
                className="form-input" 
                value={accountNum}
                onChange={(e) => setAccountNum(e.target.value)}
                placeholder="e.g. 1234"
              />
            </div>

            {template === 'settlement' && (
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="debtBalance">Outstanding Balance ($)</label>
                  <input 
                    id="debtBalance"
                    type="number" 
                    className="form-input" 
                    value={debtBalance}
                    onChange={(e) => setDebtBalance(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="proposedOffer">Proposed Settlement ($)</label>
                  <input 
                    id="proposedOffer"
                    type="number" 
                    className="form-input" 
                    value={proposedOffer}
                    onChange={(e) => setProposedOffer(e.target.value)}
                    placeholder="2000"
                  />
                </div>
              </div>
            )}

            {template === 'hardship' && (
              <div className="form-group">
                <label className="form-label" htmlFor="proposedMonthly">Proposed Temporary Monthly Payment ($)</label>
                <input 
                  id="proposedMonthly"
                  type="number" 
                  className="form-input" 
                  value={proposedMonthly}
                  onChange={(e) => setProposedMonthly(e.target.value)}
                  placeholder="100"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="hardshipReason">Hardship Classification</label>
              <select 
                id="hardshipReason"
                className="form-select"
                value={hardshipReason}
                onChange={(e) => setHardshipReason(e.target.value)}
              >
                <option value="unemployment">Loss of Employment / Unemployed</option>
                <option value="medical">Medical Emergency / Injury</option>
                <option value="income_reduction">Reduction in Regular Income</option>
                <option value="natural_disaster">Natural Disaster Emergency</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output Preview Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="card-title">
              <Sparkles size={20} style={{ color: 'var(--success)' }} />
              Draft Preview
            </h3>
            <button 
              onClick={handleCopy} 
              className="btn btn-primary" 
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="letter-box">
            {generateLetter()}
          </div>
          
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: '1.4' }}>
            *Disclaimer: This draft letter constitutes a template. It does not represent formal legal representation. Adjust specific details and addresses to match your regional laws and creditor's designated mitigation departments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NegotiationEmail;
