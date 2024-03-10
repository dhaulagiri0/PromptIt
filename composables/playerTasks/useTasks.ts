import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  getDoc,
  getDocs,
  query,
  orderBy,
  type Unsubscribe,
  Firestore,
  updateDoc,
  deleteField,
  setDoc
} from 'firebase/firestore'

export default function() {
  const nuxtApp = useNuxtApp();
  const db = nuxtApp.$firestore;
  const uncommonWords: string[] = [
    "Esoteric",
    "Ubiquitous",
    "Serendipity",
    "Idiosyncratic",
    "Epitome",
    "Ephemeral",
    "Opaque",
    "Altruistic",
    "Cacophony",
    "Euphemism",
    "Colloquial",
    "Paradox",
    "Quixotic",
    "Reticent",
    "Taciturn",
    "Vicarious",
    "Zealous",
    "Panacea",
    "Paradigm",
    "Quagmire",
    "Labyrinth",
    "Abstruse",
    "Discombobulate",
    "Exacerbate",
    "Flummox",
    "Ineffable",
    "Mellifluous",
    "Ostentatious",
    "Prosaic",
    "Recalcitrant",
    "Vicissitude",
    "Cogent",
    "Diatribe",
    "Efficacious",
    "Frivolous",
    "Gregarious",
    "Harbinger",
    "Incendiary",
    "Juxtaposition",
    "Laconic",
    "Maelstrom",
    "Nadir",
    "Obfuscate",
    "Palliate",
    "Quotidian",
    "Rancorous",
    "Sagacious",
    "Tumultuous",
    "Ubiquity",
    "Vehement"
  ];

  // clears general and indiv tasks
  async function clearTasks(
    gameId: string,
  ) {
    const docRef = doc(db, "games", gameId);
    const docSnap = checkGame(gameId);

    if (docSnap != null) {
      await updateDoc(docRef, {
        generalTasks: deleteField()
      });
      await updateDoc(docRef, {
        indivTasks: deleteField()
      });
    } else {
      console.log("game does not exist!");
    }
  };

  // attempt to retrieve game data
  // returns null if game does not exist
  async function checkGame(
    gameId: string,
  ) {
    try {
      const docRef = doc(db, "games", gameId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function addTasks(
    gameId: string,
  ) {
    const docRef = doc(db, "games", gameId)
    const generalTasks = {
      "generalTasks": {
        "Task 3": {
          "description": "Description for task3",
          "taskStatus": "not completed"
        },
        "Task 2": {
          "description": "Description for task2",
          "taskStatus": "not completed"
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
            } catch (error) {
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

  function picRand(arr: any[], n: number): any[] {
    const shuffled = Array.from(arr).sort(() => 0.5 - Math.random());
    var selected;
    if (n <= arr.length) {
      selected = shuffled.slice(0, n);
    } else {
      selected = shuffled;
    }
    return selected
  }

  // pick n tasks from a given array of tasks
  // and converts them into a dictionary of
  // task ids to tasks
  function pickRandomTasks(arr: any[], n: number): {} {
    const selected:any[] = picRand(arr, n)
    var tasks = {};
    selected.forEach(task => {
      tasks[task["id"]] = task;
      tasks[task["id"]]["status"] = "incomplete";
    })
    return tasks;
  }



  // returns a dictionary of tasks 
  // with "general" and "individual" as keys
  async function retrieveTasks() {
    const colRef = collection(db, "tasks");
    const querySnap = await getDocs(colRef);
    var tasks = {}
    querySnap.forEach((doc) => tasks[doc.id] = doc.data());
    return tasks;
  }


  // returns a dictionary of players
  // found in a game with playerIds as keys
  async function retrievePlayers(
    gameId: string,
  ) {
    const docSnap = await checkGame(gameId);
    if (docSnap != null) {
      const players = docSnap.data()["players"];
      return players;
    } else {
      console.log("error retrieving game info!");
      return null;
    }
  }

  // randomly selects n individual tasks from
  // firebase to the given player for given game
  async function addGeneralTasks(
    gameId: string,
    numTasks: number = 2,
  ) {
    const docRef = doc(db, "games", gameId)
    const generalTasks = (await retrieveTasks())["general"]["tasks"];
    const selectedTasks = pickRandomTasks(generalTasks, numTasks);
    for (var key in selectedTasks) {
        if (key == "wordSet") {
            const selectedWords = picRand(uncommonWords, 5);
            selectedTasks[key].description = "Score extra points by including the following words in your prompts : " + selectedWords.join(" ")
        };
    }
    const docSnap = checkGame(gameId);
    if (docSnap != null) {
      await setDoc(docRef, { "generalTasks": selectedTasks });
      return "success";
    } else {
      console.log("error retrieving game info!");
      return null;
    }
  }

  // randomly selects n individual tasks from
  // firebase to the given player for given game
  async function addIndividualTask(
    gameId: string,
    playerId: string,
    numTasks: number = 3,
  ) {
    const indivTasks = (await retrieveTasks())["individual"]["tasks"];
    const selectedTasks = pickRandomTasks(indivTasks, numTasks);
    const docSnap = checkGame(gameId);
    const docRef = doc(db, "games", gameId);
    if (docSnap != null) {
      const add = {}
      add[playerId] = selectedTasks;
      await setDoc(docRef, { "indivTasks": add }, { merge: true });
      return "success";
    } else {
      console.log("error retrieving game info!");
      return null;
    }
  }

  // set status of given task in given
  // game to complete
  // if no playerId is given, the given
  // task is treated as a general task
  async function updateTaskStatus(
    gameId: string,
    taskId: string,
    playerId: string | null = null,
  ) {
    // verify game data
    const docSnap = checkGame(gameId);
    if (docSnap == null) return null;

    var update = {}
    if (playerId == null) {
      // general task case
      update = {
        "generalTasks": {
          [taskId]: {
            "status": "completed"
          }
        }
      }
    } else {
      update = {
        "indivTasks": {
          [playerId]: {
            [taskId]: {
              "status": "completed"
            }
          }
        }
      }
    }

    // update
    try {
      const docRef = doc(db, "games", gameId);
      const res = await setDoc(docRef, update, { merge: true });
      return "success";
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  return {
    checkGame,
    clearTasks,
    addTasks,
    updateTaskStatus,
    addIndividualTask,
    retrievePlayers,
    addGeneralTasks
  }
}
