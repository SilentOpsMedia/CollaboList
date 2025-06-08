import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardProps {
  onSignOut: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSignOut }) => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl px-10 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">CollaboList</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-md transition"
          >
            Sign Out
          </button>
        </div>

        <hr className="border-gray-200" />

        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">
          <p className="text-gray-500">✅ Your collaborative checklist will appear here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;