import { doc, setDoc, updateDoc, deleteDoc, getDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { 
  getChecklistDocRef, 
  getChecklistsCollectionRef,
  getCurrentUid
} from '../firebase/firebaseUtils';

/**
 * Checklist Service
 * 
 * Provides methods for managing checklists in Firestore with user-scoped security.
 * All operations automatically use the currently authenticated user's UID
 * to ensure data isolation between users.
 */

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Checklist {
  id: string;
  title: string;
  description?: string;
  items: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  // Add any additional fields as needed
}

export const checklistService = {
  /**
   * Creates a new checklist for the current user
   * @param checklistData - The checklist data (without id and timestamps)
   * @returns The created checklist with generated ID and timestamps
   */
  async createChecklist(checklistData: Omit<Checklist, 'id' | 'createdAt' | 'updatedAt'>): Promise<Checklist> {
    try {
      // Get the current user's ID (will throw if not authenticated)
      const userId = getCurrentUid();
      
      // Create a new document reference with auto-generated ID
      const checklistRef = doc(getChecklistsCollectionRef());
      
      const now = new Date();
      const newChecklist: Checklist = {
        ...checklistData,
        id: checklistRef.id,
        createdBy: userId,
        createdAt: now,
        updatedAt: now,
      };
      
      // Save to Firestore
      await setDoc(checklistRef, newChecklist);
      
      return newChecklist;
    } catch (error) {
      console.error('Error creating checklist:', error);
      throw new Error('Failed to create checklist');
    }
  },

  /**
   * Updates an existing checklist
   * @param checklistId - The ID of the checklist to update
   * @param updates - The fields to update
   * @returns Promise that resolves when the update is complete
   */
  async updateChecklist(
    checklistId: string, 
    updates: Partial<Omit<Checklist, 'id' | 'createdAt' | 'createdBy'>>
  ): Promise<void> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      
      // Only include defined fields in the update
      const updateData: Partial<Checklist> = {
        ...updates,
        updatedAt: new Date()
      };
      
      await updateDoc(checklistRef, updateData);
    } catch (error) {
      console.error('Error updating checklist:', error);
      throw new Error('Failed to update checklist');
    }
  },

  /**
   * Deletes a checklist
   * @param checklistId - The ID of the checklist to delete
   * @returns Promise that resolves when the deletion is complete
   */
  async deleteChecklist(checklistId: string): Promise<void> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      await deleteDoc(checklistRef);
    } catch (error) {
      console.error('Error deleting checklist:', error);
      throw new Error('Failed to delete checklist');
    }
  },

  /**
   * Gets a checklist by ID
   * @param checklistId - The ID of the checklist to retrieve
   * @returns The checklist data or null if not found
   */
  async getChecklist(checklistId: string): Promise<Checklist | null> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      const checklistDoc = await getDoc(checklistRef);
      
      if (!checklistDoc.exists()) {
        return null;
      }
      
      return checklistDoc.data() as Checklist;
    } catch (error) {
      console.error('Error getting checklist:', error);
      throw new Error('Failed to get checklist');
    }
  },

  /**
   * Adds an item to a checklist
   * @param checklistId - The ID of the checklist to add the item to
   * @param item - The item to add
   * @returns Promise that resolves when the item is added
   */
  async addChecklistItem(
    checklistId: string, 
    item: Omit<ChecklistItem, 'id' | 'createdAt' | 'completed'>
  ): Promise<void> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      const checklistDoc = await getDoc(checklistRef);
      
      if (!checklistDoc.exists()) {
        throw new Error('Checklist not found');
      }
      
      const checklist = checklistDoc.data() as Checklist;
      const newItem: ChecklistItem = {
        ...item,
        id: crypto.randomUUID(),
        completed: false,
        createdAt: new Date()
      };
      
      await updateDoc(checklistRef, {
        items: [...(checklist.items || []), newItem],
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error adding checklist item:', error);
      throw new Error('Failed to add checklist item');
    }
  },

  /**
   * Updates a checklist item
   * @param checklistId - The ID of the checklist containing the item
   * @param itemId - The ID of the item to update
   * @param updates - The fields to update on the item
   * @returns Promise that resolves when the update is complete
   */
  async updateChecklistItem(
    checklistId: string,
    itemId: string,
    updates: Partial<Omit<ChecklistItem, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      const checklistDoc = await getDoc(checklistRef);
      
      if (!checklistDoc.exists()) {
        throw new Error('Checklist not found');
      }
      
      const checklist = checklistDoc.data() as Checklist;
      const updatedItems = (checklist.items || []).map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            ...updates,
            updatedAt: new Date()
          };
        }
        return item;
      });
      
      await updateDoc(checklistRef, {
        items: updatedItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating checklist item:', error);
      throw new Error('Failed to update checklist item');
    }
  },

  /**
   * Removes an item from a checklist
   * @param checklistId - The ID of the checklist containing the item
   * @param itemId - The ID of the item to remove
   * @returns Promise that resolves when the item is removed
   */
  async removeChecklistItem(checklistId: string, itemId: string): Promise<void> {
    try {
      const checklistRef = getChecklistDocRef(checklistId);
      const checklistDoc = await getDoc(checklistRef);
      
      if (!checklistDoc.exists()) {
        throw new Error('Checklist not found');
      }
      
      const checklist = checklistDoc.data() as Checklist;
      const filteredItems = (checklist.items || []).filter(item => item.id !== itemId);
      
      await updateDoc(checklistRef, {
        items: filteredItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error removing checklist item:', error);
      throw new Error('Failed to remove checklist item');
    }
  },

  /**
   * Fetches all checklists for the currently authenticated user
   * @returns {Promise<Array<{id: string} & Omit<Checklist, 'id'>>>} Array of checklists with their IDs
   * @throws {Error} If user is not authenticated or if there's an error fetching checklists
   */
  async getAllChecklists(): Promise<Array<{id: string} & Omit<Checklist, 'id'>>> {
    try {
      // Get a reference to the checklists collection scoped to the current user
      // This ensures users can only access their own checklists
      const checklistsCollection = getChecklistsCollectionRef();
      
      // Create a query that orders checklists by their updatedAt timestamp (newest first)
      const checklistsQuery = query(
        checklistsCollection,
        orderBy('updatedAt', 'desc')
      );
      
      // Execute the query
      const querySnapshot = await getDocs(checklistsQuery);
      
      // Map the documents to an array of checklists with their IDs
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Array<{id: string} & Omit<Checklist, 'id'>>;
    } catch (error) {
      console.error('Error fetching checklists:', error);
      
      // Provide more specific error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          throw new Error('You do not have permission to access these checklists');
        } else if (error.message.includes('unauthenticated')) {
          throw new Error('You must be logged in to view checklists');
        }
      }
      
      throw new Error('Failed to fetch checklists');
    }
  }
};
