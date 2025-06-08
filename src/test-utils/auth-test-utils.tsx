import React, { ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, AuthContextType } from '../contexts/AuthContext';
import { User } from '../types/user';

// Create a test theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Default mock user data
const defaultUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  isActive: true,
  role: 'user',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
    },
  },
};

// Default mock auth context
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  signInWithGoogle: jest.fn(),
  signInWithApple: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  confirmPasswordReset: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn(),
  sendEmailVerification: jest.fn(),
  reloadUser: jest.fn(),
  isEmailVerified: false,
  isInitialized: true,
};

interface TestWrapperProps {
  children: ReactNode;
  authContext?: Partial<AuthContextType>;
  routerProps?: MemoryRouterProps;
}

/**
 * TestWrapper component that provides all necessary providers
 */
const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  authContext = {},
  routerProps = {},
}) => {
  const mergedAuthContext = {
    ...defaultAuthContext,
    ...authContext,
    user: authContext.user || defaultUser,
  };

  return (
    <ThemeProvider theme={theme}>
      <MemoryRouter {...routerProps}>
        <AuthProvider value={mergedAuthContext as AuthContextType}>
          {children}
        </AuthProvider>
      </MemoryRouter>
    </ThemeProvider>
  );
};

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  authContext?: Partial<AuthContextType>;
  routerProps?: MemoryRouterProps;
}

/**
 * Custom render function that includes all necessary providers
 */
const customRender = (
  ui: React.ReactElement,
  {
    authContext = {},
    routerProps = {},
    ...renderOptions
  }: CustomRenderOptions = {}
): RenderResult => {
  return render(ui, {
    wrapper: ({ children }) => (
      <TestWrapper authContext={authContext} routerProps={routerProps}>
        {children}
      </TestWrapper>
    ),
    ...renderOptions,
  });
};

// Re-export everything from testing-library/react
export * from '@testing-library/react';

// Override render method
export { customRender as render };

// Export test utilities
export const authTestUtils = {
  createMockUser: (overrides: Partial<User> = {}): User => ({
    ...defaultUser,
    ...overrides,
  }),
  
  createMockAuthContext: (overrides: Partial<AuthContextType> = {}): AuthContextType => ({
    ...defaultAuthContext,
    ...overrides,
    user: overrides.user || defaultUser,
  }),
  
  // Helper to wait for async operations
  waitForAsync: (ms = 0): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms)),
  
  // Mock Firebase auth responses
  mockFirebaseAuth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signInWithPopup: jest.fn(),
    signInWithRedirect: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    confirmPasswordReset: jest.fn(),
    verifyPasswordResetCode: jest.fn(),
    applyActionCode: jest.fn(),
    checkActionCode: jest.fn(),
    reload: jest.fn(),
    updateProfile: jest.fn(),
    updateEmail: jest.fn(),
    updatePassword: jest.fn(),
    sendEmailVerification: jest.fn(),
  },
  
  // Mock Firestore responses
  mockFirestore: {
    collection: jest.fn().mockReturnThis(),
    doc: jest.fn().mockReturnThis(),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    onSnapshot: jest.fn(),
    where: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    startAfter: jest.fn().mockReturnThis(),
  },
};

// Export types
export type { User, AuthContextType };
