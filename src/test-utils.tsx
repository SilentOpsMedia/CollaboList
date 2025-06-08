import React, { ReactElement, ReactNode, useMemo } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { ThemeProvider, Theme, createTheme } from '@mui/material/styles';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { AuthContextType, useAuthContext, AuthProvider } from './contexts/AuthContext';
import { User } from './types/user';

// Create a default theme for testing
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    error: {
      main: '#f44336',
    },
    background: {
      default: '#fff',
      paper: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  route?: string;
  initialEntries?: string[];
  authContext?: Partial<AuthContextType>;
};

interface TestWrapperProps {
  children: ReactNode;
  routerProps?: MemoryRouterProps;
  authContext?: Partial<AuthContextType>;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ 
  children, 
  routerProps = {}, 
  authContext = {} 
}) => {
  return (
    <ThemeProvider theme={theme as Theme}>
      <AuthProvider>
        <MemoryRouter {...routerProps}>
          {children}
        </MemoryRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  {
    route = '/',
    initialEntries = [route],
    authContext = {},
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  window.history.pushState({}, 'Test page', route);
  
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper 
        routerProps={{ initialEntries }}
        authContext={authContext}
      >
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Re-export everything from @testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Custom test utilities
export const createMockUser = (overrides: Partial<User> = {}) => {
  const now = new Date().toISOString();
  
  return {
    // Required fields
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    
    // Optional fields
    photoURL: 'https://example.com/photo.jpg',
    emailVerified: true,
    isActive: true,
    role: 'user',
    createdAt: now,
    updatedAt: now,
    metadata: {
      lastLogin: now,
      failedLoginAttempts: 0,
      preferences: {
        theme: 'system',
        notifications: {
          email: true,
          push: true
        }
      }
    },
    
    // Firebase User properties (for compatibility)
    uid: 'test-uid',
    phoneNumber: null,
    isAnonymous: false,
    providerData: [],
    refreshToken: 'test-refresh-token',
    
    // Firebase User methods
    delete: jest.fn(),
    getIdToken: jest.fn().mockResolvedValue('test-id-token'),
    getIdTokenResult: jest.fn().mockResolvedValue({
      token: 'test-id-token',
      expirationTime: new Date(Date.now() + 3600 * 1000).toISOString(),
      authTime: now,
      issuedAtTime: now,
      signInProvider: 'password',
      signInSecondFactor: null,
      claims: {},
    }),
    reload: jest.fn().mockResolvedValue(undefined),
    toJSON: jest.fn(),
    
    // Allow overrides
    ...overrides,
  };
};

export const mockFirebaseAuth = (user = null, error = null) => ({
  currentUser: user,
  onAuthStateChanged: (callback: (user: any) => void) => {
    callback(user);
    return jest.fn();
  },
  signInWithEmailAndPassword: jest.fn(() => 
    Promise.resolve({ user, credential: null, operationType: 'signIn' })
  ),
  createUserWithEmailAndPassword: jest.fn(() => 
    Promise.resolve({ user, credential: null, operationType: 'signIn' })
  ),
  signInWithPopup: jest.fn(() => 
    Promise.resolve({ user, credential: null, operationType: 'signIn' })
  ),
  signInWithRedirect: jest.fn(() => Promise.resolve()),
  getRedirectResult: jest.fn(() => Promise.resolve({ user: null })),
  signOut: jest.fn(() => Promise.resolve()),
  sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
  confirmPasswordReset: jest.fn(() => Promise.resolve()),
  verifyPasswordResetCode: jest.fn(() => Promise.resolve('test@example.com')),
  applyActionCode: jest.fn(() => Promise.resolve()),
  checkActionCode: jest.fn(() => 
    Promise.resolve({
      data: { email: 'test@example.com' },
      operation: 'PASSWORD_RESET',
    })
  ),
  sendSignInLinkToEmail: jest.fn(() => Promise.resolve()),
  isSignInWithEmailLink: jest.fn(() => true),
  signInWithEmailLink: jest.fn(() => 
    Promise.resolve({ user, credential: null, operationType: 'signIn' })
  ),
  onIdTokenChanged: jest.fn((callback) => {
    if (user) callback(user);
    return jest.fn();
  }),
  ...(error ? { error } : {}),
});
