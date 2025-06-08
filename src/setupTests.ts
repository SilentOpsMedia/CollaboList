import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Mock Firebase
jest.mock('firebase/auth');
jest.mock('firebase/firestore');
jest.mock('firebase/storage');

// Mock Firebase Auth
export const mockSignInWithEmailAndPassword = jest.fn();
export const mockCreateUserWithEmailAndPassword = jest.fn();
export const mockSignInWithPopup = jest.fn();
export const mockSignInWithRedirect = jest.fn();
export const mockSignOut = jest.fn();
export const mockSendPasswordResetEmail = jest.fn();
export const mockConfirmPasswordReset = jest.fn();
export const mockVerifyPasswordResetCode = jest.fn();
export const mockApplyActionCode = jest.fn();
export const mockCheckActionCode = jest.fn();
export const mockReload = jest.fn();
export const mockUpdateProfile = jest.fn();
export const mockUpdateEmail = jest.fn();
export const mockUpdatePassword = jest.fn();
export const mockSendEmailVerification = jest.fn();

// Mock Firestore
export const mockCollection = jest.fn();
export const mockDoc = jest.fn();
export const mockSetDoc = jest.fn();
export const mockGetDoc = jest.fn();
export const mockUpdateDoc = jest.fn();
export const mockDeleteDoc = jest.fn();

// Mock window object for Firebase
const mockWindowGapi = {
  load: jest.fn(),
  client: {
    init: jest.fn().mockResolvedValue({}),
  },
};

// @ts-ignore
window.gapi = mockWindowGapi;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

// Configure test behavior
configure({ testIdAttribute: 'data-testid' });

import React from 'react';

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  
  return {
    ...originalModule,
    useNavigate: () => jest.fn(),
    useLocation: () => ({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: 'test',
    }),
    useParams: () => ({}),
    useSearchParams: () => [new URLSearchParams(), jest.fn()],
    Link: ({ children, to, ...rest }: { children: React.ReactNode; to: string }) => (
      React.createElement('a', { href: to, ...rest }, children)
    ),
    Navigate: ({ to }: { to: string }) => 
      React.createElement('div', null, `Navigated to ${to}`)
  };
});

// Add TextEncoder and TextDecoder for JSDOM
// @ts-ignore
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;
