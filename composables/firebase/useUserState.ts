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
    type DocumentData
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
            console.log(snapshot.val()["state"])
            if (snapshot.val() == false) {
                return;
            };

            onDisconnect(presenceRef).set(isOfflineForDatabase).then(function() {
                set(presenceRef, isOnlineForDatabase);
            });
        })
    };

    async function subscribePlayerState(playerId: string, callback: () => void) {
        const presenceRef = ref(fdb, 'users/' + playerId);
        onValue(presenceRef, (snapshot) => {
            if (snapshot.val() == false) {
                return;
            }
            const playerState = snapshot.val()["state"]
            if (playerState == "offline") {
                // do stuff
                callback();
                return;
            };
        })
    }

    return {
        onDisconnectListener,
    };
}