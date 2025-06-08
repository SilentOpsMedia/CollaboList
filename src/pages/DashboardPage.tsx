import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../components/dashboard/Dashboard';

interface DashboardPageProps {
  onSignOut: () => Promise<void>;
}

/**
 * Dashboard Page Component
 * 
 * Wrapper component that renders the main Dashboard and handles authentication state.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onSignOut - Function to handle sign out
 * @returns {JSX.Element} The DashboardPage component
 */
const DashboardPage: React.FC<DashboardPageProps> = ({ onSignOut }) => {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Dashboard onSignOut={onSignOut} />
    </div>
  );
};

export default DashboardPage;
