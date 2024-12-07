import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const loginUser = async (email, password) => {
  const authInstance = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in: ', error);
    throw error;
  }
};

export const logoutUser = async () => {
  const authInstance = getAuth();
  try {
    await signOut(authInstance);
  } catch (error) {
    console.error('Error logging out: ', error);
    throw error;
  }
};
