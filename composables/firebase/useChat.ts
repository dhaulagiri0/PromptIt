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
    // const user = await getCurrentUser();
    // if (!user) {
    //   throw new Error('User not logged in');
    // }

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

  return {
    subscribeMessages,
    sendMessage
  };
}
