import React from 'react';
import { Menu, User, Bell } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  const userName = localStorage.getItem('user_name') || 'Financial Recoverer';
  const role = localStorage.getItem('user_role') || 'USER';

  return (
    <nav className="navbar">
      <button className="navbar-toggle" onClick={toggleSidebar} aria-label="Toggle Sidebar">
        <Menu size={24} />
      </button>
      
      <div className="navbar-brand-mobile" style={{ display: 'none', fontWeight: 'bold' }}>
        AI Debt Relief
      </div>

      <div className="navbar-actions" style={{ marginLeft: 'auto' }}>
        <div className="navbar-notification" style={{ cursor: 'pointer', position: 'relative', color: 'var(--text-secondary)' }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%'
          }}></span>
        </div>
        
        <div className="navbar-user">
          <div className="avatar" style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <User size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{userName}</span>
            <span className={`badge ${role === 'ADMIN' ? 'badge-approved' : 'badge-pending'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
              {role}
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
