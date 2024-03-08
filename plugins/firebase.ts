import { initializeApp, type FirebaseOptions } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const firebaseConfig: FirebaseOptions = config.public.firebase;

  const app = initializeApp(firebaseConfig);
  return {
    provide: {
      auth: getAuth(app),
      firestore: getFirestore(app),
      storage: getStorage(app),
      firebase: getDatabase(app),
    }
  };
});

