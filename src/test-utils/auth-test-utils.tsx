import React, { ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { MemoryRouter, MemoryRouterProps } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, AuthContextType } from '../contexts/AuthContext';
import { User } from '../types/user';

// Create a test theme
export const testTheme = createTheme({
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
    creationTime: new Date().toISOString(),
    lastSignInTime: new Date().toISOString(),
  },
  preferences: {
    theme: 'light' as const,
    notifications: true,
  },
};

// Default mock user with all required properties
export function createMockUser(overrides: Partial<User> = {}): User {
  // Create base user with default values
  const baseUser: User = {
    ...defaultUser,
    role: 'user' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: {
      lastLogin: new Date().toISOString(),
      failedLoginAttempts: 0,
      preferences: {
        theme: 'light' as const,
        notifications: {
          email: true,
          push: true,
        },
      },
    },
  };

  // Apply overrides while preserving the correct types
  const mergedUser: User = {
    ...baseUser,
    ...overrides,
    // Ensure role is one of the allowed values
    role: (overrides.role && ['user', 'admin', 'moderator'].includes(overrides.role) 
      ? overrides.role 
      : 'user') as 'user' | 'admin' | 'moderator',
    metadata: {
      ...baseUser.metadata!,
      ...(overrides.metadata || {}),
      preferences: {
        ...baseUser.metadata!.preferences!,
        ...(overrides.metadata?.preferences || {}),
        theme: (overrides.metadata?.preferences?.theme as 'light' | 'dark' | 'system' | undefined) || 'light',
        notifications: {
          ...baseUser.metadata!.preferences!.notifications!,
          ...(overrides.metadata?.preferences?.notifications || {}),
        },
      },
    },
  };

  return mergedUser;
}

// Default mock auth context with all required methods
export const defaultAuthContext: AuthContextType = {
  // State
  user: null,
  loading: false,
  isInitialized: true,
  isEmailVerified: false,
  isAppleSignInAvailable: false,
  error: null,
  
  // Auth methods
  signIn: jest.fn().mockResolvedValue(undefined),
  signUp: jest.fn().mockResolvedValue(undefined),
  signOut: jest.fn().mockResolvedValue(undefined),
  signInWithGoogle: jest.fn().mockResolvedValue(undefined),
  signInWithApple: jest.fn().mockResolvedValue(undefined),
  
  // User management
  updateEmail: jest.fn().mockResolvedValue(undefined),
  changePassword: jest.fn().mockResolvedValue(undefined),
  deleteUser: jest.fn().mockResolvedValue(undefined),
  
  // Email related
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined)
};

interface TestWrapperProps {
  children: ReactNode;
  authContext?: Partial<AuthContextType>;
  routerProps?: MemoryRouterProps;
  value?: AuthContextType;
}

// Create a mock AuthContext for testing
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

/**
 * TestWrapper component that provides all necessary providers
 */
const TestWrapper: React.FC<TestWrapperProps> = ({
  children,
  authContext = {},
  routerProps = {},
  value,
}) => {
  const contextValue = value || {
    ...defaultAuthContext,
    ...authContext,
    user: authContext.user !== undefined ? authContext.user : defaultAuthContext.user,
  };

  // Create a test auth context with our mock values
  const testAuthContext: AuthContextType = {
    ...defaultAuthContext,
    ...authContext,
    user: authContext.user !== undefined ? authContext.user : defaultAuthContext.user,
  };

  return (
    <ThemeProvider theme={testTheme}>
      <MemoryRouter {...routerProps}>
        <AuthContext.Provider value={testAuthContext}>
          {children}
        </AuthContext.Provider>
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
  // Create a mock user with proper role validation
  createMockUser: (overrides: Partial<User> = {}): User => {
    const baseUser: User = {
      ...defaultUser,
      role: 'user',
      ...overrides,
    };
    
    // Ensure role is one of the allowed values
    if (overrides.role && !['user', 'admin', 'moderator'].includes(overrides.role)) {
      delete baseUser.role;
    }
    
    return baseUser;
  },
  
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
    withConverter: jest.fn().mockReturnThis(),
  },
};

// Export types
export type { User, AuthContextType };
