import {
  createUserWithEmailAndPassword,
  type User,
  onAuthStateChanged,
  GoogleAuthProvider,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth"

import {
  doc,
  setDoc,
} from "firebase/firestore"

export default function() {
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$firestore;
  const auth = nuxtApp.$auth;

  function getCurrentUser(): Promise<User | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        user => {
          unsubscribe();
          resolve(user);
        },
        reject
      );
    });
  }

  function validatePassword(password: string): boolean {
    return (
      password.length >= 10 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }

  async function createUser(email: string, password: string, username: string): Promise<User> {
    try {
      if (!validatePassword(password))
        throw new Error("Invalid Password");
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newAccount = await setDoc(doc(db, `accounts/${userCred.user.uid}`), {
        username,
        email,
      });
      return userCred.user;
    } catch (err: any) {
      throw createError({
        message: err.message,
        statusCode: err.code,
        fatal: true
      });
    }
  }

  async function logInUser(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function logInUserWithGoogle() {
    try {
      const googleProvider = await new GoogleAuthProvider();
      const user = await signInWithPopup(auth, googleProvider);
      const newAccount = await setDoc(doc(db, `accounts/${user.user.uid}`), {
        username: user.user.displayName,
        email: user.user.email
      });
    } catch (e: any) {
      throw createError({
        message: e.message,
        statusCode: e.code,
        fatal: true
      });
    }
  }

  async function logout() {
    await signOut(auth);
  }

  async function sendResetEmail(email: string) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent to " + email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        throw createError({
          message: errorCode,
          statusCode: errorMessage,
          fatal: true
        });
      });
  }

  return {
    sendResetEmail,
    logout,
    logInUser,
    validatePassword,
    logInUserWithGoogle,
    createUser,
    getCurrentUser
  };
}
