import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';

// Layout elements
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ApplyLoan from './pages/ApplyLoan';
import LoanHistory from './pages/LoanHistory';
import PredictionResult from './pages/PredictionResult';
import PredictionHistory from './pages/PredictionHistory';
import SettlementCalculator from './pages/SettlementCalculator';
import DebtCalculator from './pages/DebtCalculator';
import NegotiationEmail from './pages/NegotiationEmail';
import KnowYourRights from './pages/KnowYourRights';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Layout wrapper for all protected internal pages
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(false)} />
      <div className="main-content">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* Public Entrance Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loan/apply" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <ApplyLoan />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loan/history" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <DashboardLayout>
                  <LoanHistory />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prediction-result/:id" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <DashboardLayout>
                  <PredictionResult />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prediction-history" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <PredictionHistory />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calculator/settlement" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <SettlementCalculator />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calculator/debt" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <DebtCalculator />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/negotiation" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <NegotiationEmail />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rights" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <DashboardLayout>
                  <KnowYourRights />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['USER', 'ADMIN']}>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Admin Protected Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } 
          />

          {/* Fallback 404 Route */}
          <Route 
            path="*" 
            element={
              <DashboardLayout>
                <NotFound />
              </DashboardLayout>
            } 
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
