import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const token = localStorage.getItem('access_token');

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        color: 'var(--danger)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        animation: 'pulse 2s infinite'
      }}>
        <ShieldAlert size={40} />
      </div>
      
      <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: 'var(--text-primary)' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', lineHeight: '1.6', marginBottom: '2.5rem' }}>
        The financial recovery resource or tool page you requested could not be located. It might have been moved or archived.
      </p>

      <Link to={token ? "/dashboard" : "/"} className="btn btn-primary">
        <ArrowLeft size={18} />
        <span>Return to Safety</span>
      </Link>
    </div>
  );
};

export default NotFound;
