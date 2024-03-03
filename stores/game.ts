import { defineStore } from 'pinia'

import {
    type DocumentData
  } from 'firebase/firestore'

export const useGameStore = defineStore('game_states', () => {
    const hostId = ref("")
    const gameId = ref("")
    const antagonistId = ref("")
    const aiSeshId = ref("")
    const gameStatus = ref("lobby")
    const generalTasks = ref({})
    const indiv = ref({})
    const players = ref([])

    function updateState(gameData: DocumentData) {
        console.log(gameData)
        console.log("we updating")
        hostId.value = gameData["hostId"]
    }

  
    return { hostId, gameId, updateState }
  })