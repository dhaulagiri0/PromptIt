import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    where,
    updateDoc,
    type Unsubscribe,
    type DocumentData,
    setDoc
  } from 'firebase/firestore'
  import { type User } from 'firebase/auth';
  import { storeToRefs } from 'pinia';
import { AIMessage } from '../useTypes';
  
  export default function() {
    const { $firestore: db } = useNuxtApp();
    const { subscribePlayerState } = useUserState();

    const obfuscater = (str, rep) => {
        if (!str) return;                      // Do nothing if no string passed
        const arr = [...str];                  // Convert String to Array
        const len = arr.length;
        // obfuscate 80%
        var i: number = (len * 0.8)|0;
        i = Math.min(Math.abs(i), len);        // Fix to Positive and not > len 
        while (i) {
          const r = ~~(Math.random() * len);
          if (Array.isArray(arr[r])) continue; // Skip if is array (not a character)
          arr[r] = [rep];                      // Insert an Array with the rep char
          --i;
        }
        return arr.flat().join("");
    };

    async function listenLiveMessage(
        gameId: string,
        obfuscate: boolean = true,
        callback: (message: AIMessage, messages: AIMessage[]) => void,
    ):Promise<Unsubscribe> {
        const messagesRef = collection(db, 'messages/AIChats/' + gameId);
        const q = query(messagesRef, orderBy('createdAt'));

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data()
            })).reverse();
            if (obfuscate) {
                messages.map((message) => {
                    // message.text = message.text.split(" ").map((str) => obfuscater(str, "*")).join(" ");
                    message.text = message.text
                })
            }
            callback(messages[messages.length - 1], messages);
        });
    }

    async function sendLiveMessage(
        gameId: string,
        user: User,
        message: string,
        roundNum: number,
        image: string = "",
    ) {
    if (!message) {
        return;
        }
    
        try {
            const messagesRef = doc(db, 'messages/AIChats/' + gameId, user.uid + "-" + roundNum);
            const messagesDoc = await setDoc(messagesRef, {
                    text: message,
                    createdAt: new Date().toISOString(),
                    sentBy: user.uid,
                    userName: user.displayName,
                    image: image,
                    roundNum: roundNum,
            }, { merge:true });
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    }

    async function updateGameState(
        gameId: string,
        newState: string,
    ) {
        const gameRef = doc(db, "games", gameId);
        await setDoc(gameRef, { state: newState,}, { merge: true });
        return
    }

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
        updateGameState,
        subscribeGameState,
        sendLiveMessage,
        listenLiveMessage,
    };
  }