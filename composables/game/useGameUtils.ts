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
  
export default function() {
    const { $firestore: db } = useNuxtApp();
    const { subscribePlayerState } = useUserState();

    // update the game progress with which player is 
    // currently taking a turn
    // also sets the current round number
    async function setGameProgress(
        gameId: string,
        playerId: string,
        roundNumber: number,
    ) {
        const gameRef = doc(db, "games", gameId);
        await setDoc(gameRef, { currentPlayerId: playerId, roundNum: roundNumber}, { merge: true });
        return
    }

    function generateNextPlayers (
        prevFirstPlayerIds: string[] = [],
        prevLastPlayerIds: string[] = [],
        players,
    ): [string, string] {

        const keys: string[] = Object.keys(players)

        // everyone has gone, game should conclude
        if (prevLastPlayerIds.length == keys.length) {
            return ["", ""]
        }

        // check if someone has gone first already
        if (prevFirstPlayerIds.length != 0) {
            // last player who went first becomes the last player
            const nextLastPlayer = prevFirstPlayerIds[prevFirstPlayerIds.length - 1];

            //pick another random player to go first
            const notGone = keys.filter(playerId => !prevFirstPlayerIds.includes(playerId));
            const nextFirstPlayer = notGone[0];
            
            return [nextFirstPlayer, nextLastPlayer];
        }

        // no one has gone, select a random player to go
        const shuffled = Array.from(keys).sort(() => 0.5 - Math.random());
        const firstPlayer =  shuffled[0];
        const lastPlayer = ((shuffled.length > 1) ? shuffled[1] : shuffled[0]);
        return [firstPlayer, lastPlayer]
    }



    return {
        setGameProgress,
        generateNextPlayers,
    };

}
