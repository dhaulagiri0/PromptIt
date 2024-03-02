import {
  createUserWithEmailAndPassword,
  type User,
  onAuthStateChanged,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "firebase/auth"

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

  async function createUser(email: string, password: string): Promise<User> {
    try {
      if (!validatePassword(password))
        throw new Error("Invalid Password");
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
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
    createUser,
    getCurrentUser
  };
}
