l<template>
    <div class="bg-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
        <Header back-visible="true" />
        <main class="grow flex flex-row justify-center space-x-4 px-4 pb-4 h-5/6">
            <div class="flex flex-col basis-1/4 h-fill space-y-4">
                {{ currentPlayerId }}
                {{ roundNum }}
                <WindowCard class="flex-1 flex-col" headerText="Team Chat">
                    <div id="con" class="h-full">
                        <div class="h-full">
                            <div 
                                :key="allMessages"
                                id="messagebox" 
                                class="
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
                                            "
                                        >
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
                                                    text-s
                                                    max-w-48
                                                    text-nowrap
                                                    text-ellipsis
                                                    "
                                                    v-if="(index == 0 && user != null && message.sentBy != user.uid) || (user != null && message.sentBy != user.uid && allMessages[index - 1] != undefined && allMessages[index - 1].sentBy != message.sentBy)"
                                                    >
                                                    {{ message.userName }}
                                                </div>
                                                <div class="
                                                    w-fit
                                                    rounded-vl
                                                    overflow-hidden
                                                    p-3
                                                    pl-5
                                                    pr-5
                                                    font-gohu
                                                    text-s
                                                    "
                                                    :class="`${user != null && message.sentBy != user.uid ? 'bg-grapefruit text-black' : 'justify-self-end bg-richblue text-offwhite'}`"                                                >
                                                    {{ message.text }}
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
                <form class="w-fill flex-1/5 flex space-x-2" @submit.prevent="handleSendMessage">
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
                        placeholder:text-richgrey
                        border-4" placeholder="message"
                        v-model="newMessage"/>

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
                        bg-grapefruit"
                        type="submit">  
                        Send    
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
                    border-4
                    text-offwhite
                    font-gohu
                    text-xl
                    drop-shadow-solid
                    "
                    >
                    <div 
                        :key="aiMessages"
                        id="messagebox" 
                        class="
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
                                "
                                >
                                <!-- <div v-if="message.roundNum == roundNum" class="flex-1 space-y-2 mb-4 w-fill grid">
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
                                        text-s
                                        max-w-48
                                        text-nowrap
                                        text-ellipsis
                                        "
                                        v-if="(index == 0 || aiMessages[index - 1].roundNum != roundNum) || (index == 0 && user != null && message.sentBy != user.uid) || (user != null && message.sentBy != user.uid && allMessages[index - 1] != undefined && allMessages[index - 1].sentBy != message.sentBy)"
                                        >
                                        {{ message.userName }}
                                    </div> -->
                                    <div v-if="message.roundNum == roundNum" class="flex-1 space-y-2 mb-4 w-fill grid">
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
                                        text-s
                                        max-w-48
                                        text-nowrap
                                        text-ellipsis
                                        "
                                        v-if="(user != null && message.sentBy != user.uid)">
                                        {{ message.userName }}
                                    </div>
                                    <div class="
                                        w-fill
                                        rounded-vl
                                        overflow-hidden
                                        p-3
                                        pl-5
                                        pr-5
                                        font-gohu
                                        text-s
                                        text-wrap
                                        "
                                        :class="`${user != null && message.sentBy != user.uid ? 'bg-grapefruit text-black' : 'justify-self-end bg-richblue text-offwhite'}`"                                                >
                                        <p class="w-fill text-wrap">{{ message.text }}</p>  
                                    </div>
                                    <div class="
                                        w-fit
                                        rounded-vl
                                        overflow-hidden
                                        "
                                        v-if="message.image && (hasGone || (onTurn && index == allMessages.length - 1))"
                                        :class="`${user != null && message.sentBy != user.uid ? 'bg-grapefruit text-black' : 'justify-self-end bg-richblue text-offwhite'}`"                                                >
                                        <img :src="message.image"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>
                <form v-if="onTurn" class="w-fill flex space-x-4" @submit.prevent="handlePromptMessage">
                    <textarea    
                        class="
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
                        border-4" placeholder="Enter your guess here!"
                        v-model="newPrompt"/>

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
                        text-xl"
                        type="submit">  
                        ENTER    
                    </button>    
                </form>  
            </div>
            <div class="flex-1 basis-1/4 h-fill grid space-y-4">
                <div class="
                    border-black
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-offwhite
                    border-4
                    text-black
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    >
                    <p class="mb-4 text-xl">General Challenges:</p>
                    <div v-for="(task, index) in generalTasks" :key="task">
                        <div class="
                            container
                            flex
                            flex-col
                            items-left
                            ">
                        <p class="text-m block">{{ index + ". " + task.name }}</p>
                        <p class="text-s mb-4 block">{{ task.description }}</p>
                        </div>
                    </div>
                </div>
                <div class="
                    border-black
                    rounded-vl
                    overflow-hidden
                    p-3
                    pl-5
                    pr-5
                    bg-offwhite
                    border-4
                    text-black
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    >
                    <p class="mb-4 text-xl">Individual Challenges:</p>
                    <div v-if="user" v-for="(task, index) in indivTasks[user.uid]" :key="task">
                        <div class="
                            container
                            flex
                            flex-col
                            items-left
                            ">
                        <p class="text-m block">{{ index + ". " + task.name }}</p>
                        <p class="text-s mb-4 block">{{ task.description }}</p>
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
const { updateGameState, listenLiveMessage, sendLiveMessage } = useGameListeners();
import { onBeforeMount } from 'vue';
const { generateNextPlayers, setGameProgress } = useGameUtils();
const { getCurrentUser } = useAuth();
const { sendAIMessage } = useChat();
const { getNextImage, generateInitialPrompt, rateCreativity, rateCloseNess,} = useGameSystems();
const gameStore = useGameStore();
const user = ref(null);
const newMessage = ref<string>('');
const newPrompt = ref<string>("")
const enableMainChat = ref(false)
const router = useRouter();
var lastMessage = ref("");
var lastImage:string = ""
var lastRound = 0
var promptWatcher = null;
import { onMounted, watch } from 'vue';
import type { Unsubscribe } from 'firebase/auth';
import useGameSystems from '~/composables/game/useGameSystems';
import useChat from '~/composables/firebase/useChat';

export type AIMessage = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
  image:string;
  roundNum:number;
}

const { hostId, players, generalTasks, indivTasks, currentPlayerId, roundNum, gameId } = storeToRefs(gameStore);

const allMessages = ref<AIMessage[]>([]);
const aiMessages = ref<AIMessage[]>([]);


onBeforeMount(async () => {
    const _user = await getCurrentUser();
    if (_user) {
      user.value = _user;
    } else {
      router.push(`/`);
    }


    subscribeMessages(gameId.value, 
        (messages: AIMessage[]) => {
            console.log(messages);
            console.log(messages.map((message: AIMessage) => message.text));
            allMessages.value = []
            messages.map(
                (message: AIMessage) => { 
                    allMessages.value.push({
                        text:message["text"],
                        createdAt:message["createdAt"],
                        sentBy:message["sentBy"],
                        userName:message["userName"],
                    });
                });
    });
    // update current game state
    if (user.value.uid == hostId.value) {
        await updateGameState(gameId.value, "started");
        handleGameHost()
    }
})

async function handleSendMessage() {
  await sendMessage(newMessage.value, gameId.value);
  newMessage.value = '';
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

var hasGone = ref(false);
var onTurn = ref(false);

async function handlePromptMessage() {
    console.log("handling prompts")
    promptWatcher = watch(newPrompt, async () => {
        console.log(newPrompt.value)
        await sendLiveMessage(gameId.value, user.value, newPrompt.value, roundNum.value)
    })
}


async function handleGameHost() {
    var nextFirstPlayerId = "";
    var nextLastPlayerId = "";
    var round = 0;
    var firstPlayers = []
    var lastPlayer = []

    // deciding on the first pair of first and last players
    const _players = generateNextPlayers([], [], players.value);
    nextFirstPlayerId = _players[0];
    nextLastPlayerId = _players[1];
    firstPlayers.push(nextFirstPlayerId)
    lastPlayer.push(nextLastPlayerId)
    
    while ((nextFirstPlayerId != "" && nextLastPlayerId != "") || round == 0) {
        round += 1;
        console.log("NEW ROUND")
        
        var prevPrompt = await generateInitialPrompt();
        var prevImage = await getNextImage(prevPrompt);
        
        await sendAIMessage(gameId.value, "Original prompt: " + prevPrompt, prevImage.toString(), round)
        await setGameProgress(gameId.value, nextFirstPlayerId, round);
        await delay(60000);
        console.log(nextFirstPlayerId + " finished from round: " + round)

        // slight delay to make sure the message is updated
        await delay(5000);
        prevPrompt = lastMessage.value;
        prevImage = await getNextImage(prevPrompt);
        await sendAIMessage(gameId.value, nextFirstPlayerId + " generated the following image: ", prevImage.toString(), round)


        const shuffledKeys = Array.from(Object.keys(players.value)).sort(() => 0.5 - Math.random());
        for (var key of shuffledKeys) {
            if (key != nextLastPlayerId && key != nextFirstPlayerId) {
                await setGameProgress(gameId.value, key, round);
                await delay(60000);
                console.log("another player finish from round: " + round)

                // slight delay to make sure the message is updated
                await delay(5000);
                prevPrompt = lastMessage.value;
                prevImage = await getNextImage(prevPrompt);
                await sendAIMessage(gameId.value, nextFirstPlayerId + " generated the following image: ", prevImage.toString(), round)
            }
        }

        await setGameProgress(gameId.value, nextLastPlayerId, round);
        await delay(60000);
        console.log("last player finish from round: " + round)

        // slight delay to make sure the message is updated
        await delay(5000);
        prevPrompt = lastMessage.value;
        prevImage = await getNextImage(prevPrompt);
        await sendAIMessage(gameId.value, nextFirstPlayerId + " generated the following image: ", prevImage.toString(), round)

        // deciding on the next pair of first and last players
        const _players = generateNextPlayers(firstPlayers, lastPlayer, players.value);
        nextFirstPlayerId = _players[0];
        nextLastPlayerId = _players[1];
        firstPlayers.push(nextFirstPlayerId)
        lastPlayer.push(nextLastPlayerId)
    }

    await updateGameState(gameId.value, "ended");
}


var prevUnsub = await listenLiveMessage(
        gameId.value, 
        true,
        (message, messages) => {
            lastMessage.value = message.text
            aiMessages.value = []
            messages.map(
                (message: AIMessage) => { 
                    aiMessages.value.push({
                        text:message["text"],
                        createdAt:message["createdAt"],
                        sentBy:message["sentBy"],
                        userName:message["userName"],
                        image: message["image"],
                        roundNum: message["roundNum"],
                    });
                });
        })
    
watch(currentPlayerId, async () => {
    console.log(currentPlayerId.value)
    console.log(user.value.uid)

    if (promptWatcher != null) {
        promptWatcher();
        promptWatcher = null
    }
    if (lastRound != roundNum.value) {
        hasGone.value = false
    }
    onTurn.value = false
    // if(prevUnsub) {
    //     prevUnsub();
    // }

    if (currentPlayerId.value == user.value.uid) {
        onTurn.value = true
        // do game stuff
        // enable main chat interaction
        // update live message
        // send message to ai
        // if message is empty propagate previously generated image
        enableMainChat.value = true;
        handlePromptMessage();
        console.log("my turn")
        hasGone.value = true
    } else {
        console.log("not my turn")
        enableMainChat.value = false
    }
})

</script>