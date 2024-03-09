<template>
  <div class="bg-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
    <Header back-visible="true" />
    <main class="grow flex flex-row justify-center space-x-4 px-4 pb-4">
      <div class="flex flex-col basis-1/4 h-fill space-y-4">
        <WindowCard class="flex-1 flex-col" headerText="Team Chat">
          <div id="con" class="h-full">
            <div class="h-fill">
              <div :key="allMessages" id="messagebox" class="
                                overflow-y-scroll
                                no-scrollbar
                                scrolling-auto
                                h-5/6">
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
                                                    text-s
                                                    max-w-48
                                                    text-nowrap
                                                    text-ellipsis
                                                    "
                          v-if="(index == 0 && user != null && message.sentBy != user.uid) || (user != null && message.sentBy != user.uid && allMessages[index - 1] != undefined && allMessages[index - 1].sentBy != message.sentBy)">
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
                          :class="`${user != null && message.sentBy != user.uid ? 'bg-grapefruit text-black' : 'justify-self-end bg-richblue text-offwhite'}`">
                          {{ message.text }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </WindowCard>
        <button @click="handleStartPrompt">
          Hello
        </button>
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
                        bg-grapefruit" type="submit">
            Send
          </button>
        </form>
      </div>
      <div class="
                flex-1 basis-2/4
                border-white
                rounded-vl
                overflow-hidden
                p-3
                pl-5
                pr-5
                bg-black
                border-4
                text-offwhite
                font-gohu
                text-xl
                h-fill
                ">
      </div>
      <div v-if="user" class="flex-1 basis-1/4 h-fill grid space-y-4">
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
                    ">
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
                    ">
          <p class="mb-4 text-xl">Individual Challenges:</p>
          <div v-for="(task, index) in indivTasks[user.uid]" :key="task">
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
const { updateGameState } = useGameListeners();
import { onBeforeMount } from 'vue';
const { getCurrentUser } = useAuth();
const gameStore = useGameStore();
const user = ref(null);
const newMessage = ref<string>('');
const { generateInitialPrompt, generateInitialImage } = useGameSystems();

type Message = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
};

const gameId = ref<string>("SkillIssue");
const roundNum: number = 2;

const { hostId, players, generalTasks, indivTasks, gameStatus } = storeToRefs(gameStore);

const allMessages = ref<Message[]>([]);

onBeforeMount(async () => {
  const _user = await getCurrentUser();
  user.value = _user;

  console.log(user.value)
  console.log(user.value.uid)
  console.log(user.uid)

  subscribeMessages(gameId.value,
    (messages: Message[]) => {
      console.log(messages);
      console.log(messages.map((message: Message) => message.text));
      allMessages.value = []
      messages.map(
        (message: Message) => {
          allMessages.value.push({
            text: message["text"],
            createdAt: message["createdAt"],
            sentBy: message["sentBy"],
            userName: message["userName"],
          });
        });
    });
  // update current game state
  if (user.value.uid == hostId.value) {
    updateGameState(gameId.value, "started");
  }
})

async function handleSendMessage() {
  await sendMessage(newMessage.value, gameId.value);
  newMessage.value = '';
}

const imagePrompt = "Generate an image based on a deserted beach at sunset. The sun is setting over the ocean, casting long shadows on the sand. A solitary umbrella stands tall in the sand, unused and forlorn. The waves gently lap at the shore, leaving intricate patterns in the sand. A sense of peace and melancholy lingers in the air."

async function handleStartPrompt() {
  console.log(imagePrompt);
  await generateInitialImage(gameId.value, imagePrompt, roundNum)
  // await generateInitialPrompt(gameId.value, roundNum);
}
</script>
