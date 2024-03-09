import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  updateDoc,
  type Unsubscribe,
  type DocumentData,
  arrayUnion,
  FieldValue,
  update,
  setDoc
} from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage';
import { type User } from 'firebase/auth';
import { storeToRefs } from 'pinia';
import { Buffer } from 'buffer';

export default function() {
  const { getCurrentUser } = useAuth();
  const { $firestore: db, $storage: storage } = useNuxtApp();
  const { subscribePlayerState } = useUserState();
  const config = useRuntimeConfig();
  const perplexityApiKey = config.public.perplexity_api_key;
  const stabilityApiKey = config.public.stability_api_key;

  // for simulating delay only, not needed in production
  function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function getNextImage(prompt: string): Promise<URL> {
    await delay(1000)
    const imageURL = new URL("https://en.anmosugoi.com/wp-content/uploads/2024/02/Sousou-no-Frieren-Frieren-portada.webp")
    return new Promise(resolve => imageURL)
  }

  // generate initial prompt with perplexity
  // async function generateInitialPrompt(
  //   gameId: string, roundNum: number
  // ): Promise<string> {
  //   const options = {
  //     method: 'POST',
  //     headers: {
  //       accept: 'application/json',
  //       'content-type': 'application/json',
  //       authorization: `Bearer ${perplexityApiKey}`
  //     },
  //     body: JSON.stringify({
  //       model: 'mistral-7b-instruct',
  //       messages: [{ content: "Be concise, the prompt you generate is to be fed to an image generation AI. This will then be used in a game to get players to guess what your description and earn points. Therefore, do not make the scene overly complicated and stick to a few objects and points of interest. Keep it to 2 sentences, and write in plain layman english.", role: 'system' },
  //       { content: "Generate a description for an intriguing image, with a few points of interest and do not over complicate the scene, as it should be fairly easy for a human to guess the image's description. For example: these ideas can range from common games, landscapes, people, cities, objects, cars, fantasies, comics, etc. Try to evoke a specific emotion (e.g., A sense of wonder and discovery, a feeling of peace and serenity, a touch of mystery and intrigue). Start your message with something along the lines of 'Generate an image based on'.", role: 'user' }],
  //       max_tokens: 0,
  //       temperature: 1.2,
  //       top_p: 0.9,
  //       top_k: 0,
  //       stream: false,
  //       presence_penalty: 0,
  //       frequency_penalty: 1
  //     })
  //   };
  //
  //   const { data } = await useFetch('https://api.perplexity.ai/chat/completions', options);
  //   const prompt = data.value.choices[0].message.content;
  //   addPromptToFirebase(gameId, roundNum, prompt);
  //   console.log(prompt);
  //   return prompt;
  // }

  async function generateInitialImage(
    gameId: String, imagePrompt: string, roundNum: number
  ) {
    const user = await getCurrentUser();
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${stabilityApiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: imagePrompt,
          },
        ],
        cfg_scale: 7,
        height: 512,
        width: 512,
        steps: 20,
        samples: 1,
      }),
    };

    const { data } = await useFetch('https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image', options);

    interface GenerationResponse {
      artifacts: Array<{
        base64: string
        seed: number
        finishReason: string
      }>
    }
    console.log(data.value);

    const responseJSON = (await data.value) as GenerationResponse
    const image = Buffer.from(responseJSON.artifacts[0].base64, 'base64');

    try {
      const imageRef = ref(storage, `Images/${gameId}/${user.uid}-${roundNum}.png`);
      const remoteRef = await uploadBytes(imageRef, image);
      console.log("image: ", image);
      console.log(responseJSON);
      return remoteRef.metadata.fullPath
    } catch (err: any) {
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.message,
        fatal: true
      });
    }
  }

  async function addPromptToFirebase(
    gameId: string, roundNum: number, prompt: string
  ): Promise<string> {
    try {
      const docRef = doc(db, "games/", gameId);
      const roundId: string = `rounds.${roundNum}`
      console.log("roundId: ", roundId)
      const promptDoc = await updateDoc(docRef, {
        [roundId]: arrayUnion(prompt)
      })
      return promptDoc;
    } catch (e: any) {
      throw createError({
        statusCode: e.statusCode || 500,
        statusMessage: e.message,
        fatal: true
      });
    }
  };

  async function getNextImage(prompt: string): Promise<URL> {
    await delay(1000)
    console.log("image delay")
    const imageURL = new URL("https://en.anmosugoi.com/wp-content/uploads/2024/02/Sousou-no-Frieren-Frieren-portada.webp")
    return imageURL
  }


  // generate initial prompt with perplexity
  async function generateInitialPrompt(): Promise<string> {
    await delay(1000)
    console.log("prompt delay")
    return "Generate an image based on a worn-out detective's office, with a dusty bookshelf filled with mysteriously label-less books and a ticking clock on the desk, alongside a magnifying glass and a smoky pipe lying nearby."
  }

  return {
    getNextImage,
    generateInitialPrompt,
    generateInitialImage,
  };
}
