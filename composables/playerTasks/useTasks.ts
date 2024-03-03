import {
    addDoc,
    collection,
    doc,
    onSnapshot,
    getDoc,
    query,
    orderBy,
    type Unsubscribe,
    Firestore,
    setDoc
} from 'firebase/firestore'

export default function() {
    const nuxtApp = useNuxtApp();
    const db = nuxtApp.$firestore;

    async function clearTasks(
        gameId: string,
    ){
        const docRef = doc(db, "games", gameId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
        } else {
            console.log("you done fucked up boy")
        }
    };

    async function checkGame(
        gameId: string,
    ) {
        const docRef = doc(db, "games", gameId)
        return new Promise((resolve, reject) => {
            try {
                const docSnap = getDoc(docRef)
                resolve(docSnap)
            } catch(error) {
                console.log(error)
                reject("failure")
            }
        })
    }

    async function addTasks(
        gameId: string,
    ) {
        const docRef = doc(db, "games", gameId)
        const generalTasks = {
            "generalTasks" : {
                "Task 3" : {
                    "description" : "Description for task3",
                    "taskStatus" : "not completed"
                },
                "Task 2" : {
                    "description" : "Description for task2",
                    "taskStatus" : "not completed"
                }
            }
        }
        checkGame(gameId).then(
            res => {
                if (res != "failure" && res.exists()) {
                    return new Promise<void>((resolve, reject) => {
                        try {
                            const res = setDoc(docRef, generalTasks, { merge: true })
                            resolve(res)
                        } catch(error) {
                            console.log(error)
                            reject("something went wrong!")
                        }
                    })
                } else {
                    console.log("error retrieving game info!")
                }
            }
        )
    }

    return {
        clearTasks,
        addTasks,
    }
}