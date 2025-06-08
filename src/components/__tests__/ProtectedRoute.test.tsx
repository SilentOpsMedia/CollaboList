import React from 'react';
import { render, screen, waitFor } from '../../../test-utils';
import { MemoryRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../ProtectedRoute';

// Mock components for testing
const PublicPage = () => <div>Public Page</div>;
const ProtectedPage = () => <div>Protected Page</div>;
const LoginPage = () => <div>Login Page</div>;

describe('ProtectedRoute', () => {
  const renderWithRouter = (initialEntries = '/', isAuthenticated = false) => {
    return render(
      <AuthProvider
        value={{
          user: isAuthenticated ? { uid: 'test-user' } : null,
          loading: false,
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: true,
          isInitialized: true,
        }}
      >
        <MemoryRouter initialEntries={[initialEntries]}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedPage />
                </ProtectedRoute>
              }
            />
            <Route path="/public" element={<PublicPage />} />
            <Route path="/" element={<Navigate to="/public" replace />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
  };

  it('redirects to login when user is not authenticated', async () => {
    renderWithRouter('/protected', false);
    
    // Should redirect to login page
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
    
    // Protected content should not be visible
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('renders protected content when user is authenticated', async () => {
    renderWithRouter('/protected', true);
    
    // Protected content should be visible
    expect(await screen.findByText('Protected Page')).toBeInTheDocument();
    
    // Login page should not be visible
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('redirects to specified redirect path when not authenticated', async () => {
    render(
      <AuthProvider
        value={{
          user: null,
          loading: false,
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: false,
          isInitialized: true,
        }}
      >
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute redirectTo="/login">
                  <ProtectedPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should redirect to the specified login page
    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  it('shows loading state while checking authentication', async () => {
    const { container } = render(
      <AuthProvider
        value={{
          user: null,
          loading: true, // Simulate loading state
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: false,
          isInitialized: false,
        }}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <ProtectedPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should show loading indicator
    expect(container.querySelector('.MuiCircularProgress-root')).toBeInTheDocument();
    
    // Should not show protected content or redirect while loading
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('allows customizing the loading component', async () => {
    const CustomLoading = () => <div>Checking authentication...</div>;
    
    render(
      <AuthProvider
        value={{
          user: null,
          loading: true, // Simulate loading state
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: false,
          isInitialized: false,
        }}
      >
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute loadingComponent={<CustomLoading />}>
                  <ProtectedPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should show custom loading component
    expect(screen.getByText('Checking authentication...')).toBeInTheDocument();
  });

  it('allows access based on a condition', async () => {
    // Test with a condition function that checks for admin role
    const isAdmin = (user: any) => user?.role === 'admin';
    
    render(
      <AuthProvider
        value={{
          user: { uid: 'test-user', role: 'user' }, // Non-admin user
          loading: false,
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: true,
          isInitialized: true,
        }}
      >
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute condition={isAdmin} redirectTo="/unauthorized">
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should redirect to unauthorized page when condition is not met
    await waitFor(() => {
      expect(screen.getByText('Unauthorized')).toBeInTheDocument();
    });
  });

  it('allows access when condition is met', async () => {
    // Test with a condition function that checks for admin role
    const isAdmin = (user: any) => user?.role === 'admin';
    
    render(
      <AuthProvider
        value={{
          user: { uid: 'test-admin', role: 'admin' }, // Admin user
          loading: false,
          error: null,
          signIn: jest.fn(),
          signUp: jest.fn(),
          signOut: jest.fn(),
          signInWithGoogle: jest.fn(),
          signInWithApple: jest.fn(),
          sendPasswordResetEmail: jest.fn(),
          updateEmail: jest.fn(),
          updatePassword: jest.fn(),
          sendEmailVerification: jest.fn(),
          reloadUser: jest.fn(),
          isEmailVerified: true,
          isInitialized: true,
        }}
      >
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute condition={isAdmin} redirectTo="/unauthorized">
                  <div>Admin Dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    );
    
    // Should allow access when condition is met
    expect(await screen.findByText('Admin Dashboard')).toBeInTheDocument();
  });
});
