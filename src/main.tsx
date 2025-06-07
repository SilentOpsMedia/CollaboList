/**
 * Main Entry Point
 * 
 * This is the entry point of the React application.
 * It sets up the React application with necessary providers and renders the root component.
 */

// Core React imports
import React from 'react';
import ReactDOM from 'react-dom/client';

// Routing
import { BrowserRouter as Router } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Main App Component
import App from './App';

// Get the root DOM element
const rootElement = document.getElementById('root');

// Check if the root element exists
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

// Create a root
const root = ReactDOM.createRoot(rootElement);

// Render the application
root.render(
  <React.StrictMode>
    {/* 
      Router: Provides routing context to the entire application
      AuthProvider: Provides authentication context to the entire application
    */}
    <Router>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);

// Enable web vitals reporting in development
if (process.env.NODE_ENV === 'development') {
  import('./reportWebVitals').then(({ default: reportWebVitals }) => {
    reportWebVitals(console.log);
  });
}
