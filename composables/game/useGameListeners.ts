import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    where,
    type Unsubscribe,
    type DocumentData
  } from 'firebase/firestore'
  
  export default function() {
    const { $firestore: db } = useNuxtApp();

    async function subscribeGameState(
        gameId: string,
        updateState: (doc : DocumentData) => void
    ):Promise<Unsubscribe> {
        const q = query(collection(db, "games"), where("gameId", "==", gameId));
        return onSnapshot(
            q,
            (snapshot) => { 
                snapshot.docChanges().forEach((change) => {
                    updateState(change.doc.data())
                })
            }
        );
    }

    return {
        subscribeGameState,
    };
  }