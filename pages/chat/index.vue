<template>
  <div 
    class="font-gohu">
    <h1>Chat</h1>
    <div v-for="message in allMessages" :key="message">
      <p>{{ message }}</p>
    </div>
    <form @submit.prevent="handleSendMessage">
      <input v-model="newMessage"/>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { Unsubscribe } from 'firebase/auth';

const { subscribeMessages, sendMessage } = useChat();

const Message = reactive<Message>({
  text: '',
});

const allMessages = ref<string[]>([]);

let unsubscribeMessages: Unsubscribe | null = null;

onMounted(async () => {
  unsubscribeMessages = await subscribeMessages("williamChat", (messages: Message[]) => {
    console.log(messages);
    console.log(messages.map((message: Message) => message.text));
    allMessages.value = messages.map((message: Message) => message.text);
  });
})

onUnmounted(() => {
  unsubscribeMessages?.();
});

const newMessage = ref<string>('');

async function handleSendMessage() {
  await sendMessage(newMessage.value, "williamChat");
  newMessage.value = '';
}
</script>
