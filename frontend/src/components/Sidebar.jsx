import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  History, 
  Calculator, 
  Mail, 
  BookOpen, 
  User, 
  LogOut, 
  Users, 
  FileCheck, 
  BrainCircuit 
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const role = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isUser = role === 'USER';
  const isAdmin = role === 'ADMIN';

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-brand">
        <span>AI Debt Relief</span>
      </div>
      <ul className="sidebar-menu">
        {isUser && (
          <>
            <li className="sidebar-item">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <LayoutDashboard size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/loan/apply" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <FileText size={20} />
                <span>Apply for Loan</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/loan/history" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <History size={20} />
                <span>Loan History</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/prediction-history" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <BrainCircuit size={20} />
                <span>AI Predictions</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/calculator/settlement" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <Calculator size={20} />
                <span>Settlement Calc</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/calculator/debt" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <Calculator size={20} />
                <span>Debt & EMI Calc</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/negotiation" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <Mail size={20} />
                <span>Email Generator</span>
              </NavLink>
            </li>
            <li className="sidebar-item">
              <NavLink 
                to="/rights" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <BookOpen size={20} />
                <span>Know Your Rights</span>
              </NavLink>
            </li>
          </>
        )}

        {isAdmin && (
          <>
            <li className="sidebar-item">
              <NavLink 
                to="/admin/dashboard" 
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={toggleSidebar}
              >
                <LayoutDashboard size={20} />
                <span>Admin Dashboard</span>
              </NavLink>
            </li>
          </>
        )}

        <li className="sidebar-item" style={{ marginTop: 'auto' }}>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={toggleSidebar}
          >
            <User size={20} />
            <span>Profile</span>
          </NavLink>
        </li>
        <li className="sidebar-item">
          <button onClick={handleLogout} className="sidebar-link w-full text-left" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
