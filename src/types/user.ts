/**
 * @file src/types/user.ts
 * @description TypeScript type definitions for User entities and related data structures
 * 
 * This module defines all TypeScript interfaces and types related to user management
 * in the application. It provides type safety for user data across the entire codebase,
 * from database operations to UI components.
 * 
 * ## Key Types
 * - `User`: Complete user data structure as stored in the database
 * - `UserInput`: Data required to create a new user
 * - `UserUpdate`: Fields that can be updated for an existing user
 * - `UserCredentials`: Authentication credentials (email/password)
 * - `PublicUserProfile`: User data safe for public display
 * - `UserResponse`: Standardized API response format for user operations
 * 
 * ## Usage Examples
 * ```typescript
 * // Type-safe user creation
 * const newUser: UserInput = {
 *   email: 'user@example.com',
 *   password: 'securePassword123!',
 *   displayName: 'John Doe',
 *   role: 'user' as const,
 * };
 * 
 * // Type-safe user update
 * const updates: UserUpdate = {
 *   displayName: 'John Updated',
 *   photoURL: 'https://example.com/new-avatar.jpg',
 *   metadata: {
 *     preferences: {
 *       theme: 'dark',
 *       notifications: { email: true, push: false }
 *     }
 *   }
 * };
 * 
 * // Type-safe API response handling
 * function handleUserResponse(response: UserResponse) {
 *   if (response.success && response.data) {
 *     console.log('User data:', response.data);
 *   } else {
 *     console.error('Error:', response.error?.message);
 *   }
 * }
 * ```
 * 
 * @see https://www.typescriptlang.org/docs/handbook/2/objects.html
 * @see https://firebase.google.com/docs/reference/js/firebase.User
 * @module types/user
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Base user interface representing a user in the system
 */
export interface User {
  /** 
   * Unique identifier for the user (Firebase Auth UID)
   * @example 'abc123def456'
   */
  id: string;
  
  /** 
   * User's email address (must be unique)
   * @example 'user@example.com'
   */
  email: string;
  
  /** 
   * User's display name
   * @example 'John Doe'
   */
  displayName: string;
  
  /** 
   * URL to the user's profile photo
   * @example 'https://example.com/photo.jpg'
   */
  photoURL?: string;
  
  /** 
   * Whether the user's email has been verified
   * @default false
   */
  emailVerified?: boolean;
  
  /** 
   * Whether the user account is active
   * @default true
   */
  isActive?: boolean;
  
  /** 
   * User's role in the system
   * @default 'user'
   */
  role?: 'user' | 'admin' | 'moderator';
  
  /** 
   * Timestamp when the user was created
   * @example { seconds: 1623456789, nanoseconds: 123000000 }
   */
  createdAt: Timestamp | Date | string;
  
  /** 
   * Timestamp when the user was last updated
   * @example { seconds: 1623456789, nanoseconds: 123000000 }
   */
  updatedAt: Timestamp | Date | string;
  
  /** 
   * Timestamp when the user was deactivated (if applicable)
   * @example { seconds: 1623456789, nanoseconds: 123000000 }
   */
  deletedAt?: Timestamp | Date | string;
  
  /** 
   * Additional metadata about the user
   */
  metadata?: {
    /** Last login timestamp */
    lastLogin?: Timestamp | Date | string;
    /** Number of failed login attempts */
    failedLoginAttempts?: number;
    /** IP address of last login */
    lastLoginIp?: string;
    /** User preferences */
    preferences?: {
      theme?: 'light' | 'dark' | 'system';
      notifications?: {
        email?: boolean;
        push?: boolean;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  
  /** Additional custom fields */
  [key: string]: unknown;
}

/**
 * User input data for creating a new user
 * Used during registration and user creation flows
 */
export interface UserInput {
  /** User's email address */
  email: string;
  
  /** User's password (only used during registration) */
  password: string;
  
  /** User's display name */
  displayName: string;
  
  /** URL to user's profile photo */
  photoURL?: string;
  
  /** Whether the user's email has been verified */
  emailVerified?: boolean;
  
  /** Whether the user account is active */
  isActive?: boolean;
  
  /** User's role in the system */
  role?: 'user' | 'admin' | 'moderator';
  
  /** Timestamp when the user was created */
  createdAt?: Timestamp | Date | string;
  
  /** Timestamp when the user was last updated */
  updatedAt?: Timestamp | Date | string;
  
  /** Additional metadata */
  metadata?: {
    /** Last login timestamp */
    lastLogin?: Timestamp | Date | string;
    /** Number of failed login attempts */
    failedLoginAttempts?: number;
    /** User preferences */
    preferences?: {
      theme?: 'light' | 'dark' | 'system';
      notifications?: {
        email?: boolean;
        push?: boolean;
      };
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

/**
 * Data that can be updated for an existing user
 * Excludes immutable fields like id
 */
export interface UserUpdate {
  /** Updated display name */
  displayName?: string;
  
  /** Updated profile photo URL */
  photoURL?: string | null;
  
  /** Updated email address */
  email?: string;
  
  /** Whether the user is active */
  isActive?: boolean;
  
  /** User's role */
  role?: 'user' | 'admin' | 'moderator';
  
  /** Updated metadata */
  metadata?: Record<string, unknown>;
  
  /** 
   * Always updated to current timestamp on update
   * @internal
   */
  updatedAt?: Timestamp | Date | string;
  
  /** 
   * Set when deactivating a user
   * @internal
   */
  deletedAt?: Timestamp | Date | string | null;
}

/**
 * User credentials for authentication
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * User profile information that can be publicly displayed
 */
export interface PublicUserProfile {
  id: string;
  displayName: string;
  photoURL?: string;
  role?: string;
  createdAt: Date | string;
}

/**
 * Response format for user-related API calls
 */
export interface UserResponse {
  success: boolean;
  data?: User | PublicUserProfile | null;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
