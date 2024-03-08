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
        gameStore
    ):Promise<Unsubscribe> {
        const { hostId } = storeToRefs(gameStore)
        const q = query(collection(db, "games"), where("gameId", "==", gameId));
        return onSnapshot(
            q,
            (snapshot) => { 
                snapshot.docChanges().forEach((change) => {
                    console.log("update")
                    if (user["uid"] == hostId.value) {
                        const players = change.doc.data()["players"]
                        for (let key in players) {
                            if (key != hostId.value) {
                                subscribePlayerState(key, gameId, () => console.log("remove user"))
                            }
                        }
                    }
                    gameStore.updateState(change.doc.data());
                })
            }
        );
    }

    return {
        subscribeGameState,
    };
  }