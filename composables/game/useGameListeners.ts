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
  import { type User } from 'firebase/auth';
  import { storeToRefs } from 'pinia';
  
  export default function() {
    const { $firestore: db } = useNuxtApp();
    const { subscribePlayerState } = useUserState();

    async function subscribeGameState(
        user: User,
        gameId: string,
        gameStore,
        callback: () => void,
    ):Promise<Unsubscribe> {
        const { hostId } = storeToRefs(gameStore)
        const q = query(collection(db, "games"), where("gameId", "==", gameId));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => { 
                snapshot.docChanges().forEach((change) => {
                    gameStore.updateState(change.doc.data());
                    if (user["uid"] == hostId.value) {
                        const players = change.doc.data()["players"]
                        for (let key in players) {
                            if (key != hostId.value) {
                                subscribePlayerState(key, gameId)
                            }
                        }
                    } else {
                        const players = change.doc.data()["players"]
                        if (!(user["uid"] in players)) {
                            // kicked
                            callback();
                            unsubscribe();
                        }
                    } 
                })
            }
        );
        return unsubscribe;
    }

    return {
        subscribeGameState,
    };
  }