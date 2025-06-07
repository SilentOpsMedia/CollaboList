/**
 * User Services
 * 
 * This module provides functions to interact with user data in Firestore.
 * It handles CRUD operations for user documents and ensures data consistency.
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
      const updateData: Partial<User> = {
        ...updates,
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