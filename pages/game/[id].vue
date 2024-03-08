l<template>
    <div class="bg-richblue h-screen font-gohu overflow-x-hidden flex flex-col">
        <Header back-visible="true" />
        <main class="grow flex flex-row justify-center space-x-4 px-4 pb-4">
            <WindowCard class="flex flex-col basis-1/4 h-full" headerText="Team Chat">
                <div id="con" class="h-full space-y-4">
                    <div>
                        <div 
                            :key="allMessages"
                            id="messagebox" 
                            class="
                            overflow-y-scroll
                            no-scrollbar
                            scrolling-auto
                            h-[500px]">
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
                                                text-offwhite
                                                font-gohu
                                                text-s
                                                "
                                                :class="`${user != null && message.sentBy != user.uid ? 'bg-black' : 'justify-self-end bg-richblue'}`"                                                >
                                                {{ message.text }}
                                            </div>
                                            <!-- <div class="
                                                w-fit
                                                rounded-vl
                                                overflow-hidden
                                                p-3
                                                pl-5
                                                pr-5
                                                text-offwhite
                                                font-gohu
                                                text-s
                                                bg-richblue
                                                justify-self-end
                                                "
                                                v-else
                                                >
                                                {{ message.text }}
                                            </div> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form class="w-fill flex space-x-2" @submit.prevent="handleSendMessage">
                        <input class="
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
            </WindowCard>
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
                "
                >
                <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
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
                    text-offwhite
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    >
                    <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
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
                    text-offwhite
                    font-gohu
                    text-xl
                    grow
                    drop-shadow-solid
                    "
                    :class="[shadow ? 'drop-shadow-solid' : '']"
                    >
                    <h3 class="text-ellipsis text-nowrap">{{ text }}</h3>
                </div>
            </div>
        </main>
    </div>
</template>


<script setup lang="ts">
import { useGameStore } from '~/stores/game'; 
const { subscribeMessages, sendMessage } = useChat();
import { onBeforeMount } from 'vue';
const { getCurrentUser } = useAuth();
const gameStore = useGameStore();
const user = ref(null);
const newMessage = ref<string>('');
const gameId = "williamChat"

type Message = {
  text: string;
  sentBy: string | undefined;
  createdAt: string | undefined;
  userName: string | undefined;
};

const { hostId, players, gameStatus } = storeToRefs(gameStore);

const allMessages = ref<Message[]>([]);


onBeforeMount(async () => {
    const _user = await getCurrentUser();
    user.value = _user;

    console.log(user.value)

    subscribeMessages(gameId, 
        (messages: Message[]) => {
            console.log(messages);
            console.log(messages.map((message: Message) => message.text));
            allMessages.value = []
            messages.map(
                (message: Message) => { 
                    allMessages.value.push({
                        text:message["text"],
                        createdAt:message["createdAt"],
                        sentBy:message["sentBy"],
                        userName:message["userName"],
                    });
                });
        });
})

async function handleSendMessage() {
  await sendMessage(newMessage.value, gameId);
  newMessage.value = '';
}

</script>