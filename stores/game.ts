import { defineStore } from 'pinia'

import {
    type DocumentData
  } from 'firebase/firestore'

export const useGameStore = defineStore('game_states', () => {
    const hostId = ref("");
    const gameId = ref("");
    const antagonistId = ref("");
    const aiSeshId = ref("");
    const gameStatus = ref("waiting");
    const generalTasks = ref({});
    const indivTasks = ref({});
    const players = ref({});
    const currentPlayerId = ref("");
    const roundNum = ref(0);

    function setGameId(_gameId: string) {
      gameId.value = _gameId;
    }

    function setHostId(_hostId: string) {
      gameId.value = _hostId;
    }

    // should only be used with subscribeGameState from useGameListeners
    function updateState(gameData: DocumentData) {
        console.log(gameData)
        console.log(gameData["indivTasks"])
        // console.log(gameData);
        gameId.value = gameData["gameId"];
        hostId.value = gameData["hostId"];
        antagonistId.value = gameData["antagonistId"];
        aiSeshId.value = gameData["aiSeshId"];
        gameStatus.value = gameData["state"];
        players.value = gameData["players"];
        generalTasks.value = gameData["generalTasks"];
        indivTasks.value = gameData["indivTasks"];
        currentPlayerId.value = gameData["currentPlayerId"] ? gameData["currentPlayerId"]: currentPlayerId.value;
        roundNum.value = gameData["roundNum"] ? gameData["roundNum"]: roundNum.value;
        // console.log(hostId.value)
        // console.log(players.value)
    }

    // clear all refs after game finishes
    function clearGameState() {
      hostId.value = "";
      gameId.value = "";
      antagonistId.value = "";
      aiSeshId.value = "";
      gameStatus.value = "waiting";
      generalTasks.value = {};
      indivTasks.value = {};
      players.value = [];
      currentPlayerId.value = "";
      roundNum.value = 0;
    }

  
    return { 
      roundNum,
      currentPlayerId,
      hostId, 
      gameId, 
      antagonistId, 
      aiSeshId,
      gameStatus,
      generalTasks,
      indivTasks,
      players,
      setGameId,
      setHostId, 
      updateState,
      clearGameState, }
  })