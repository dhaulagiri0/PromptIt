import {
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  where,
  type Unsubscribe
} from 'firebase/firestore';

import type { Game } from '../useTypes';

export default function() {
  const { getCurrentUser } = useAuth();
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$firestore;
  const auth = nuxtApp.$auth;

  async function createGame(userId: string) {
    try {
      const gameId = Math.random().toString(36).substr(2, 6);
      const gameRef = doc(db, "games", gameId);
      console.log("Hello");
      console.log(gameId);
      const gameDoc = await setDoc(gameRef, {
        gameId: gameId,
        host: userId,
        players: [],
        state: "waiting"
      });
      return gameRef.id;
    } catch (e: error) {
      console.error(e);
    }
  }

  async function subscribeGame(gameId: String, callback: (game: Game) => void): Unsubscribe {
    return onSnapshot(doc(db, "games", gameId), doc => {
      const game = doc.data();
      if (game) {
        callback(game as Game);
      }
    });
  }

  return {
    createGame
  };
}
