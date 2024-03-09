import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  type Unsubscribe
} from 'firebase/firestore'

export default function() {
  const { $firestore: db } = useNuxtApp();
  const { getCurrentUser } = useAuth();
  const config = useRuntimeConfig();
  const aiName = config.public.aiName

  async function subscribeMessages(chatId: String, 
    callback: (messages: Message[]) => void
  ): Promise<Unsubscribe> {
    const messagesRef = collection(db, 'messages/PersonalChats/' + chatId);
    const q = query(messagesRef, orderBy('createdAt'));

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  }

  async function sendMessage(message: string, chatId: string) {
    if (!message) {
      return;
    }

    try {
      const messagesRef = collection(db, 'messages/PersonalChats/' + chatId);
      const user = await getCurrentUser();
      const messagesDoc = await addDoc(messagesRef, {
        text: message,
        createdAt: new Date().toISOString(),
        sentBy: user.uid,
        userName: user.displayName
      });
      // console.log('Document written with ID: ', messagesDoc.id);
    } catch (error) {
      // console.error('Error adding document: ', error);
    }
  }

  async function sendAIMessage(chatId: string, message: string, image:string, roundNum:number) {
    if (!message) {
      return;
    }

    try {
      console.log("here")
      const messagesRef = collection(db, 'messages/AIChats/' + chatId);
      const user = await getCurrentUser();
      const messagesDoc = await addDoc(messagesRef, {
        text: message,
        createdAt: new Date().toISOString(),
        sentBy: aiName,
        userName: aiName,
        image: image,
        roundNum: roundNum,
      });
      // console.log('Document written with ID: ', messagesDoc.id);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  return {
    sendAIMessage,
    subscribeMessages,
    sendMessage
  };
}
