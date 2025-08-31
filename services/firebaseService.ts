
// services/firebaseService.ts

// This is a mock implementation of the Firebase Authentication service.
// It allows the app to function without a real Firebase backend,
// resolving the API key error and enabling a seamless user experience for demonstration.

// Mock User type to match the structure Firebase uses
export interface User {
  uid: string;
  isAnonymous: boolean;
  email: string | null;
}

const createMockUser = (isAnonymous: boolean, email: string | null = null): User => ({
  uid: `mock-uid-${Math.random().toString(36).substring(2, 10)}`,
  isAnonymous,
  email,
});

let mockCurrentUser: User | null = null;
let onAuthStateChangedCallback: ((user: User | null) => void) | null = null;

// Simulate async network requests
const fakeApiCall = <T>(data: T, delay = 250): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(data), delay));

const updateAuthSate = (user: User | null) => {
    mockCurrentUser = user;
    if (onAuthStateChangedCallback) {
        onAuthStateChangedCallback(user);
    }
}

export const signUp = async (email: string, _password: string): Promise<User> => {
  const newUser = createMockUser(false, email);
  updateAuthSate(newUser);
  return fakeApiCall(newUser);
};

export const signIn = async (email: string, _password: string): Promise<User> => {
  const existingUser = createMockUser(false, email);
  updateAuthSate(existingUser);
  return fakeApiCall(existingUser);
};

export const signInAsGuest = async (): Promise<User> => {
  const guestUser = createMockUser(true);
  updateAuthSate(guestUser);
  return fakeApiCall(guestUser);
};

export const signOutUser = (): Promise<void> => {
  updateAuthSate(null);
  return fakeApiCall(undefined);
};

export const onAuthStateChanged = (callback: (user: User | null) => void): (() => void) => {
    onAuthStateChangedCallback = callback;
    // Immediately invoke with current user to mirror Firebase behavior
    callback(mockCurrentUser); 
    
    // Return an unsubscribe function
    return () => {
        onAuthStateChangedCallback = null;
    };
};

export const getCurrentUser = (): User | null => {
    return mockCurrentUser;
};