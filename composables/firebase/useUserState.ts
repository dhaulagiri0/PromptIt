import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    where,
    setDoc,
    type Unsubscribe,
    type DocumentData,
    deleteField,
    updateDoc
  } from 'firebase/firestore'
import { getDatabase, ref, onDisconnect, set, onValue } from "firebase/database";
import type { User } from 'firebase/auth';
import firebase from '~/plugins/firebase';

export default function() {
    const nuxtApp = useNuxtApp();
    const db = nuxtApp.$firestore
    const fdb = nuxtApp.$firebase;
    const auth = nuxtApp.$auth;

    // updates user online state
    async function onDisconnectListener(user: User) {

        var isOfflineForDatabase = {
            state: 'offline',
        };
        
        var isOnlineForDatabase = {
            state: 'online',
        };
        const presenceRef = ref(fdb, 'users/' + user.uid);
        onValue(presenceRef, (snapshot) => {
            if (snapshot.val() == false) {
                return;
            };

            if (snapshot.val()["state"] != "offline") {
                isOnlineForDatabase = {
                    state: snapshot.val()["state"],
                }; 
            }

            onDisconnect(presenceRef).set(isOfflineForDatabase).then(function() {
                set(presenceRef, isOnlineForDatabase);
            });
        })
    };

    async function updateUserState(playerId: string, state: string) {
        const presenceRef = ref(fdb, 'users/' + playerId);
        var updateStateForDatabase = {
            state: state,
        };
        set(presenceRef, updateStateForDatabase)
    }

    async function subscribePlayerState(playerId: string, gameId: string, callback: () => void) {
        const presenceRef = ref(fdb, 'users/' + playerId);
        var isFirst = true;
        console.log("listener attached to " + playerId)
        onValue(presenceRef, (snapshot) => {
            const playerState = snapshot.val()["state"]
            if (playerState != "ingame" && !isFirst) {
                const gamePlyersRef = doc(db, "games", gameId);
                updateDoc(gamePlyersRef, { ["players." + playerId] : deleteField() });
                return
            }
            if (isFirst) {
                isFirst = false;
            }
        })
    }

    return {
        updateUserState,
        subscribePlayerState,
        onDisconnectListener,
    };
}