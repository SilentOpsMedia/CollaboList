import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from '../../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

// Mock child component
const MockDashboard = () => <div>Dashboard Content</div>;
const MockLogin = () => <div>Login Page</div>;

// Mock the useAuth hook
jest.mock('../../../contexts/AuthContext', () => ({
  ...jest.requireActual('../../../contexts/AuthContext'),
  useAuth: jest.fn(),
}));

describe('ProtectedRoute', () => {
  const renderWithRouter = (initialPath: string, user: any = null) => {
    const authValue = {
      user,
      loading: false,
      error: null,
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      signInWithGoogle: jest.fn(),
      signInWithApple: jest.fn(),
      sendPasswordResetEmail: jest.fn(),
    };

    (useAuth as jest.Mock).mockReturnValue(authValue);

    return render(
      <AuthProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<MockLogin />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MockDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('renders children when user is authenticated', () => {
    const mockUser = { uid: '123', email: 'test@example.com' };
    renderWithRouter('/dashboard', mockUser);
    
    expect(screen.getByText('Dashboard Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', async () => {
    renderWithRouter('/dashboard', null);
    
    // The component should redirect to /login, but in the test environment,
    // we need to check that the login page is rendered
    // This is because the MemoryRouter doesn't actually change the URL in the test
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('shows loading state when authentication is in progress', () => {
    // Override the useAuth mock for this test
    (useAuth as jest.Mock).mockReturnValueOnce({
      user: null,
      loading: true,
      error: null,
    });

    const { container } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MockDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );

    // Check for loading spinner or any loading indicator
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
  });
});
