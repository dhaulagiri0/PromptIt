<template>
  <div class="bg-darkergrey h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header :back-visible="true" :progress="true">
      <ProgressBar duration="30" color="richpink" :key="reset" :roundNumber="roundNum"
        :currPlayer="`${currentPlayerId == 1 ? '' : currentPlayerName}`" />
    </Header>
    <main class="grow flex flex-row justify-center space-x-4 px-4 pb-4 h-5/6">
      <div class="flex flex-col basis-1/4 h-fill space-y-4">
        <WindowCard class="flex-1 flex-col" headerText="Team Chat">
          <div id="con" class="h-full">
            <div class="h-full">
              <div :key="allMessages" id="messagebox" class="
                                overflow-y-scroll
                                no-scrollbar
                                scrolling-auto
                                h-full">
                <div>
                  <div v-for="(message, index) in allMessages" :key="message">
                    <div class="
                                            container
                                            flex
                                            items-center
                                            ">
                      <div class="flex-1 space-y-2 mb-4 w-fill grid">
                        <div class="
                                                    border-grapefruit
                                                    rounded-vl
                                                    overflow-hidden
                                                    p-3
                                                    pl-5
                                                    pr-5
                                                    bg-black
                                                    border-4
                                                    text-offwhite
                                                    font-gohu
                                                    text-l
                                                    max-w-48
                                                    text-nowrap
                                                    text-ellipsis
                                                    "
                          v-if="(index == 0 && user != null && message.sentBy != user.uid) || (user != null && message.sentBy != user.uid && allMessages[index - 1] != undefined && allMessages[index - 1].sentBy != message.sentBy)">
                          <p class="text-wrap">
                            {{ message.userName }}
                          </p>
                        </div>
                        <div class="
                                                    w-full
                                                    rounded-vl
                                                    overflow-hidden
                                                    p-3
                                                    pl-5
                                                    pr-5
                                                    font-gohu
                                                    text-xl
                                                    "
                          :class="`${user != null && message.sentBy != user.uid ? 'bg-grapefruit text-black' : 'justify-self-end bg-richblue text-offwhite'}`">
                          <p class="text-wrap">
                            {{ message.text }}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div class="h-10"></div>
                </div>
              </div>
            </div>
          </div>
        </WindowCard>
        <form class="w-fill flex-1/5 flex space-x-4" @submit.prevent="handleSendMessage">
          <input class="
                        drop-shadow-solid
                        flex-1        
                        basis-2/3            
                        border-black
                        rounded-vl
                        overflow-hidden
                        p-3
                        pl-5
                        pr-5
                        bg-offwhite
                        w-fill
                        text-xl
                        placeholder:text-richgrey
                        border-4" placeholder="message" v-model="newMessage" />

          <button class="
                        drop-shadow-solid
                        flex-1
                        basis-1/3
                        border-black
                        rounded-vl
                        overflow-hidden
                        p-3
                        pl-5
                        pr-5
                        w-fill
                        border-4 
                        text-xl
                        bg-grapefruit" type="submit">
            SEND
          </button>
        </form>
      </div>
      <div id="midCon" class="flex-1 basis-2/4 space-y-4 flex-col h-5/6" :class="onTurn ? 'h-5/6' : 'h-full'">
        <div class="
                    flex-col
                    h-full
                    border-white
                    rounded-vl
                    p-8
                    pl-5
                    pr-5
                    bg-black
                    border-8
                    text-offwhite
                    font-gohu
                    text-xl
                    drop-shadow-solid
                    ">
          <div :key="aiMessages" id="messagebox" class="
                        h-full
                        overflow-y-scroll
                        no-scrollbar
                        scrolling-auto">
            <div v-for="(message, index) in aiMessages" :key="message">
              <div class="
                                container
                                flex
                                items-center
                                w-fill
                                ">
                <div v-if="message.roundNum == roundNum" class="flex-1 space-y-2 mb-4 w-fill grid">
                  <div class="
                                        rounded-vl
                                        overflow-hidden
                                        pl-5
                                        pr-5
                                        bg-black
                                        font-gohu
                                        max-w-48
                                        text-nowrap
                                        text-ellipsis
                                        " :class="[
      `${message.sentBy == aiName ? 'text-2xl border-black text-richblue p-0' : 'text-s text-richpink p-0'}`,
    ]" v-if="(user != null && message.sentBy != user.uid)">
                    {{ message.userName }}
                  </div>
                  <div class="
                                        w-fit
                                        rounded-vl
                                        overflow-hidden
                                        pl-5
                                        pr-5
                                        font-gohu
                                        text-wrap
                                        " :class="[
      `${user != null && message.sentBy != user.uid ? 'text-offwhite' : 'justify-self-end bg-richblue text-offwhite'}`,
      `${user != null && message.sentBy == aiName ? 'text-m bg-black text-offwhite p-1 pb-8' : 'text-s p-3 mb-8'}`,
    ]">
                    <p class="w-fill text-wrap"
                      v-if="hasGone || (onTurn && (index == renderImgIndex || message.sentBy == user.uid))">
                      {{ message.text }}
                    </p>
                    <p class="w-fill text-wrap" v-else>{{ message.text.split(" ").map((str) => obfuscater(str,
      "■")).join(" ") }}</p>
                  </div>
                  <div class="
                                        w-fit
                                        rounded-vl
                                        overflow-hidden
                                        " v-if="message.image && (hasGone || (onTurn && index == renderImgIndex))"
                    :class="`${user != null && message.sentBy != user.uid ? 'bg-offwhite' : 'justify-self-end bg-richblue text-offwhite'}`">
                    <img :src="message.image" />
                  </div>
                  <!-- v-if="message.image && (((hasGone || (onTurn && index == aiMessages.length - 1))) || (onTurn && aiMessages[index - 1].sentBy == user.uid && index == aiMessages.length - 2))" -->
                </div>
              </div>
            </div>
          </div>
        </div>
        <form v-if="onTurn" class="w-fill flex space-x-4" @submit.prevent="submitPrompt">
          <textarea class="
                        no-scrollbar
                        overflow-y-scroll
                        drop-shadow-solid
                        flex-1        
                        basis-3/4            
                        border-offwhite
                        rounded-vl
                        overflow-hidden
                        p-3
                        pl-5
                        pr-5
                        bg-black
                        w-fill
                        text-offwhite
                        text-xl
                        placeholder:text-richgrey
                        border-4" placeholder="Enter your guess here!" v-model="newPrompt" />

          <button class="
                        drop-shadow-solid
                        flex-1
                        basis-1/4
                        border-black
                        rounded-vl
                        overflow-hidden
                        p-3
                        pl-5
                        pr-5
                        w-fill
                        border-[5px] 
                        bg-offwhite
                        text-xl" type="submit">
            ENTER
          </button>
        </form>
      </div>
      <div class="flex-1 basis-1/4 h-fill grid space-y-4">
        <div class="
                    border-offwhite
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-black
                    border-4
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    ">
          <p class="mb-4 text-xl text-richblue">General Challenges:</p>
          <div v-for="(task, index) in generalTasks" :key="task">
            <div class="    mb-4
                            container
                            flex
                            flex-col
                            items-left
                            ">
              <p class="text-m block text-richpink">{{ task.name }}</p>
              <p class="text-s mb-4 block text-offwhite">{{ task.description }}</p>
            </div>
          </div>
        </div>
        <div class="
                    border-offwhite
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-black
                    border-4
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    ">
          <p class="mb-4 text-xl text-richyellow">Individual Challenges:</p>
          <div v-if="user" v-for="(task, index) in indivTasks[user.uid]" :key="task">
            <div class="    mb-4
                            container
                            flex
                            flex-col
                            items-left
                            ">
              <p class="text-m block text-richpink">{{ task.name }}</p>
              <p class="text-s mb-4 block text-offwhite">{{ task.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup lang="ts">
import { useGameStore } from '~/stores/game';
const { subscribeMessages, sendMessage } = useChat();
const { updateGameState, listenLiveMessage, sendLiveMessage, obfuscater } = useGameListeners();
const { generateNextPlayers, setGameProgress } = useGameUtils();
const { clearTasks, addIndividualTask, addGeneralTasks } = useTasks();
const { getCurrentUser } = useAuth();
const { sendAIMessage } = useChat();
const { getNextImage, generateInitialPrompt, generateInitialImage, rateCreativity, rateCloseNess, generateNextImage } = useGameSystems();
const { executeVerification } = useIndividualTaskVerification();
const gameStore = useGameStore();
const user = ref(null);
const newMessage = ref<string>('');
const newPrompt = ref<string>("");
const enableMainChat = ref(false);
const router = useRouter();
var lastMessage = ref("");
var lastImage: string = "";
var lastRound = 0;
var currentPlayerName = ref("");
const renderImgIndex = ref(-1);
var promptWatcher = null;
var initialPrompt: string;
import type { Unsubscribe } from 'firebase/auth';
import useGameSystems from '~/composables/game/useGameSystems';
import useChat from '~/composables/firebase/useChat';
import useTasks from '~/composables/playerTasks/useTasks';
const config = useRuntimeConfig();
const aiName = config.public.aiName;

export type AIMessage = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
  image: string;
  roundNum: number;
}

const { hostId, players, generalTasks, indivTasks, currentPlayerId, roundNum, gameId, gameStatus } = storeToRefs(gameStore);

const allMessages = ref<AIMessage[]>([]);
const aiMessages = ref<AIMessage[]>([]);
const unObfuscatedAiMessages = ref<AIMessage[]>([]);

var hasGone = ref(false);
var onTurn = ref(false);

onBeforeMount(async () => {
  const _user = await getCurrentUser();
  if (_user) {
    user.value = _user;
  } else {
    router.push(`/`);
  }


  subscribeMessages(gameId.value,
    (messages: AIMessage[]) => {
      // console.log(messages);
      // console.log(messages.map((message: AIMessage) => message.text));
      allMessages.value = []
      messages.map(
        (message: AIMessage) => {
          allMessages.value.push({
            text: message["text"],
            createdAt: message["createdAt"],
            sentBy: message["sentBy"],
            userName: message["userName"],
          });
        }
      );
    });
  // update current game state
  if (user.value.uid == hostId.value) {
    await updateGameState(gameId.value, "started");
    handleGameHost()
  }

  watch(currentPlayerId, async () => {
    currentPlayerName.value = getUserNameFromId(currentPlayerId.value)
    if (promptWatcher != null) {
      promptWatcher();
      promptWatcher = null;
    }
    if (lastRound != roundNum.value) {
      hasGone.value = false;
      lastRound = roundNum.value
    }
    // if(prevUnsub) {
    //     prevUnsub();
    // }

    if (currentPlayerId.value == user.value.uid) {
      onTurn.value = true;
      enableMainChat.value = true;
      handlePromptMessage();
      console.log("my turn");
      resetTimer();
      await delay(30000);
      enableMainChat.value = false;
      if (!hasGone.value) {
        if (newPrompt.value != "") {
          await sendLiveMessage(gameId.value, user.value, newPrompt.value, roundNum.value);
        } else {
          await sendLiveMessage(gameId.value, user.value, "I give up!", roundNum.value);
        }
        hasGone.value = true;
      }
      await delay(5000);
      onTurn.value = false;
    } else {
      console.log("not my turn");
      await delay(5000);
      resetTimer();
      enableMainChat.value = false;
      onTurn.value = false;
    }
  });

  watch(gameStatus, async () => {
    if (gameStatus.value == "ended") {
      router.push("/")
    }
  });
})

function getUserNameFromId(playerId: string): string {
  for (let key in players.value) {
    console.log(key)
    if (key == playerId) {
      return players.value[key].name
    }
  }
  return ""
}

const reset = ref<number>(0);

function resetTimer() {
  reset.value += 1;
}

async function handleSendMessage() {
  await sendMessage(newMessage.value, gameId.value);
  newMessage.value = '';
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var prevUnsub = await listenLiveMessage(
  gameId.value,
  (message, messages) => {
    lastMessage.value = message.text
    aiMessages.value = []
    messages.map(
      (message: AIMessage) => {
        if (true) {
          aiMessages.value.push({
            text: message["text"],
            createdAt: message["createdAt"],
            sentBy: message["sentBy"],
            userName: message["userName"],
            image: message["image"],
            roundNum: message["roundNum"],
          });
        }
      });
    if (messages[0].image != "") {
      renderImgIndex.value = 0;
    } else if (messages[1].image != "") {
      renderImgIndex.value = 1;
    }
  });

async function submitPrompt() {
  if (promptWatcher != null) {
    promptWatcher();
    promptWatcher = null;
  }
  sendLiveMessage(gameId.value, user.value, newPrompt.value, roundNum.value);
  newPrompt.value = "";
  onTurn.value = false;
  hasGone.value = true;
  enableMainChat.value = false;
}

async function handlePromptMessage() {
  promptWatcher = watch(newPrompt, async () => {
    await sendLiveMessage(gameId.value, user.value, newPrompt.value, roundNum.value);
  })
}

var playersToPoints: {[name:string] : Number} = {};
async function handleGameHost() {
  var nextFirstPlayerId = "";
  var nextLastPlayerId = "";
  var round = 0;
  var firstPlayers = [];
  var lastPlayer = [];
  

  //initialize dictionary of players to points
  for (var key in players.value) {
    playersToPoints[key] = 0;
  }

  // deciding on the first pair of first and last players
  const _players = generateNextPlayers([], [], players.value);
  nextFirstPlayerId = _players[0];
  nextLastPlayerId = _players[1];
  firstPlayers.push(nextFirstPlayerId);
  lastPlayer.push(nextLastPlayerId);

  while ((nextFirstPlayerId != "" && nextLastPlayerId != "") || round == 0) {
    round += 1;
    console.log("NEW ROUND");

    var prevPrompt = await generateInitialPrompt(gameId.value, round);
    initialPrompt = prevPrompt;
    var prevImageURL = await generateInitialImage(gameId.value, prevPrompt, round);
    var prevImage = await getNextImage(gameId.value, prevImageURL);

    await setGameProgress(gameId.value, nextFirstPlayerId, round);
    await sendAIMessage(gameId.value, "Original prompt: " + prevPrompt, "", round)
    await sendAIMessage(gameId.value, "Describe this image as best as you can! ", prevImage.toString(), round)
    console.log(nextFirstPlayerId + "'s round: " + round);
    await delay(30000);
    console.log(nextFirstPlayerId + " finished from round: " + round);

    // slight delay to make sure the message is updated
    await delay(5000);
    prevPrompt = lastMessage.value;
    prevImageURL = await generateNextImage(gameId.value, prevPrompt, round, nextFirstPlayerId);
    prevImage = await getNextImage(gameId.value, prevImageURL);
    await sendAIMessage(gameId.value, getUserNameFromId(nextFirstPlayerId) + " wrote a description that generated the following image: ", prevImage.toString(), round);


    const shuffledKeys = Array.from(Object.keys(players.value)).sort(() => 0.5 - Math.random());
    for (var key of shuffledKeys) {
      if (key != nextLastPlayerId && key != nextFirstPlayerId) {
        await setGameProgress(gameId.value, key, round);
        console.log(key + "'s round: " + round);
        await delay(30000);
        console.log("another player finish from round: " + round);

        // slight delay to make sure the message is updated
        await delay(5000);
        prevPrompt = lastMessage.value;
        prevImageURL = await generateNextImage(gameId.value, prevPrompt, round, key);
        prevImage = await getNextImage(gameId.value, prevImageURL);
        await sendAIMessage(gameId.value, getUserNameFromId(key) + " wrote a description that generated the following image: ", prevImage.toString(), round);
      }
    }

    await setGameProgress(gameId.value, nextLastPlayerId, round);
    console.log(nextLastPlayerId + "'s round: " + round);
    await delay(30000);
    console.log("last player finish from round: " + round);

    // slight delay to make sure the message is updated
    await delay(5000);
    prevPrompt = lastMessage.value;
    prevImageURL = await generateNextImage(gameId.value, prevPrompt, round, nextLastPlayerId);
    prevImage = await getNextImage(gameId.value, prevImageURL);
    await sendAIMessage(gameId.value, getUserNameFromId(nextLastPlayerId) + " wrote a description that generated the following image: ", prevImage.toString(), round);

    // deciding on the next pair of first and last players
    const _players = generateNextPlayers(firstPlayers, lastPlayer, players.value);
    nextFirstPlayerId = _players[0];
    nextLastPlayerId = _players[1];
    firstPlayers.push(nextFirstPlayerId);
    lastPlayer.push(nextLastPlayerId);

    // triggers currentPlayerIdChange
    await setGameProgress(gameId.value, "1", round);

    await handleRoundEnd(round);

    if (round + 1 <= players.value.length) {
        await sendAIMessage(gameId.value, "NOW FOR ROUND " + (round + 1) + "!", "", round);
        console.log("reset id " + round);

        await clearTasks(gameId.value);
        await addGeneralTasks(gameId.value)
        for (var key in players.value) {
            await addIndividualTask(gameId.value, key);
        }
        // slight delay to make sure the message is updated
        await delay(5000);
    }
  }

  console.log("game ended!")
  await handleGameEnd(round);

  await updateGameState(gameId.value, "ended");
}


async function handleRoundEnd(round: number) {
  await sendAIMessage(gameId.value, "Summary for round " + (round) + ":", "", round);
  await delay(2000)
  var winner = ""
  for (var key in players.value) {
    const prompt = aiMessages.value.filter((message) => message.roundNum == round && message.sentBy == key)[0].text;
    var pts = await rateCreativity(initialPrompt, prompt) + await rateCloseNess(initialPrompt, prompt); //TODO: add on task verify check shit
    indivTasks[key].array.forEach(async element => { pts += await executeVerification(element.id, initialPrompt, prompt)});
    playersToPoints[key] += pts;
    await sendAIMessage(gameId.value, players.value[key].name + " is now on " + (playersToPoints[key]) + " points!", "", round);
    await delay(2000)
  }
  
}

async function handleGameEnd(round) {
  
  var maxPoints : Number = 0
  let winner = "";
  for (let key in playersToPoints) {
    if (playersToPoints[key] > maxPoints) {
      winner = players.value[key].name
      maxPoints = playersToPoints[key]
    }
  }

  
  await sendAIMessage(gameId.value, "So the winner was.....", "", round);
  await delay(1000)
  await sendAIMessage(gameId.value, winner + "! Congratulations!", "", round);
  await delay(5000)
  await sendAIMessage(gameId.value, "The game has ended!", "", round);
  await delay(1000)
  await sendAIMessage(gameId.value, "Thank you all for coming!", "", round);
  await delay(1000)
  await sendAIMessage(gameId.value, "Goodbye! :)", "", round);
  await delay(1000)
}
</script>
