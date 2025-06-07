/**
 * @file src/services/userServices.ts
 * @description User management service for Firestore operations
 * 
 * This module provides a collection of functions to interact with user data
 * stored in Firestore. It handles all CRUD (Create, Read, Update, Delete) operations
 * for user documents, ensuring data consistency and type safety.
 * 
 * ## Features
 * - Create new user documents
 * - Retrieve user data by ID
 * - Update existing user information
 * - Soft delete users (mark as inactive)
 * - Type-safe operations with TypeScript interfaces
 * 
 * ## Error Handling
 * All functions throw errors that should be caught and handled by the calling code.
 * Common error cases include:
 * - Document not found
 * - Permission denied
 * - Network errors
 * - Invalid data
 * 
 * ## Usage Example
 * ```typescript
 * // Create a new user
 * await userServices.createUser({
 *   id: 'user123',
 *   email: 'user@example.com',
 *   displayName: 'John Doe',
 *   photoURL: 'https://example.com/avatar.jpg',
 *   createdAt: new Date().toISOString(),
 *   updatedAt: new Date().toISOString(),
 *   isActive: true
 * });
 * 
 * // Get user data
 * const user = await userServices.getUser('user123');
 * 
 * // Update user
 * await userServices.updateUser('user123', {
 *   displayName: 'John Updated',
 *   photoURL: 'https://example.com/new-avatar.jpg'
 * });
 * 
 * // Deactivate user
 * await userServices.deactivateUser('user123');
 * ```
 * 
 * @see https://firebase.google.com/docs/firestore
 * @module services/userServices
 */

// Firebase imports
import { doc, setDoc, getDoc, updateDoc, DocumentData } from 'firebase/firestore';

// Firebase configuration
import { db } from '../lib/firebase';

// Types
import { User, UserInput, UserUpdate } from '../types/user';

/**
 * User Services Object
 * 
 * Contains methods for managing user data in Firestore.
 */
export const userServices = {
  /**
   * Creates a new user document in Firestore
   * @param {User} user - The user data to create
   * @throws {Error} If user creation fails
   */
  async createUser(user: UserInput & { id: string }): Promise<void> {
    try {
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  /**
   * Retrieves a user document from Firestore
   * @param {string} userId - The ID of the user to retrieve
   * @returns {Promise<User | null>} The user data or null if not found
   * @throws {Error} If the user retrieval fails
   */
  async getUser(userId: string): Promise<User | null> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return userDoc.data() as User;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Updates an existing user document in Firestore
   * @param {string} userId - The ID of the user to update
   * @param {UserUpdate} updates - The fields to update
   * @throws {Error} If the user update fails
   */
  async updateUser(userId: string, updates: UserUpdate): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      
      // Create a new object with the updates, ensuring null values are handled correctly
      const updateData: Partial<User> = {
        ...updates,
        // Convert null values to undefined to match the User type
        photoURL: updates.photoURL === null ? undefined : updates.photoURL,
        deletedAt: updates.deletedAt === null ? undefined : updates.deletedAt,
        updatedAt: new Date(),
      };
      
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  },
  
  /**
   * Soft deletes a user by marking them as inactive
   * @param {string} userId - The ID of the user to deactivate
   * @throws {Error} If the user deactivation fails
   */
  async deactivateUser(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw new Error('Failed to deactivate user');
    }
  }
};