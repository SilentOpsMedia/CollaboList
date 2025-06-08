import React from 'react';
import { useAuth } from '../contexts/AuthContext';

/**
 * Dashboard Page Component
 * 
 * A simple fallback dashboard page for testing.
 * 
 * @component
 * @returns {JSX.Element} The DashboardPage component
 */
const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  console.log('DashboardPage - User:', user);

  if (!user) {
    return (
      <div style={{ padding: '2rem' }}>
        Loading user data...
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      ✅ Logged in — Dashboard placeholder
    </div>
  );
};

export default DashboardPage;
