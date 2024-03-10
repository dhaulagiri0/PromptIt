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
import { ref, uploadBytes, getStorage, getDownloadURL } from 'firebase/storage';
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

  // generate initial prompt with perplexity
  async function generateInitialPrompt(
    gameId: string, roundNum: number
  ): Promise<string> {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${perplexityApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-7b-instruct',
        messages: [{ content: "Be concise, the prompt you generate is to be fed to an image generation AI. This will then be used in a game to get players to guess what your description and earn points. Therefore, do not make the scene overly complicated and stick to a few objects and points of interest. Keep it to 2 sentences, and write in plain layman english.", role: 'system' },
        { content: "Generate a description for an intriguing image, with a few points of interest and do not over complicate the scene, as it should be fairly easy for a human to guess the image's description. For example: these ideas can range from common games, landscapes, people, cities, objects, cars, fantasies, comics, etc. Try to evoke a specific emotion (e.g., A sense of wonder and discovery, a feeling of peace and serenity, a touch of mystery and intrigue). Start your message with something along the lines of 'Generate an image based on'.", role: 'user' }],
        max_tokens: 0,
        temperature: 1.2,
        top_p: 0.9,
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      })
    };

    const { data } = await useFetch('https://api.perplexity.ai/chat/completions', options);
    const prompt = data.value.choices[0].message.content;
    addPromptToFirebase(gameId, roundNum, prompt);
    // prompt = "Generate an image based on a worn-out detective's office, with a dusty bookshelf filled with mysteriously label-less books and a ticking clock on the desk, alongside a magnifying glass and a smoky pipe lying nearby."
    return prompt;
  }

  async function generateInitialImage(
    gameId: String, imagePrompt: string, roundNum: number
  ) {
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
        height: 384,
        width: 640,
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

    const responseJSON = (await data.value) as GenerationResponse
    const image = Buffer.from(responseJSON.artifacts[0].base64, 'base64');

    try {
      const imageRef = ref(storage, `Images/${gameId}/${config.public.aiName}-${roundNum}.png`);
      const remoteRef = await uploadBytes(imageRef, image);
      return remoteRef.metadata.name
      // return "ppQVTG5oIoS15yieSbSAbkqHqax2-2.png"
    } catch (err: any) {
      throw createError({
        statusCode: err.statusCode || 500,
        statusMessage: err.message,
        fatal: true
      });
    }
  }

  async function generateNextImage(
    gameId: string, imagePrompt: string, roundNum: number, userID: string
  ) {
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
        height: 384,
        width: 640,
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

    const responseJSON = (await data.value) as GenerationResponse
    const image = Buffer.from(responseJSON.artifacts[0].base64, 'base64');

    try {
      const imageRef = ref(storage, `Images/${gameId}/${userID}-${roundNum}.png`);
      const remoteRef = await uploadBytes(imageRef, image);
      return remoteRef.metadata.name;
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

  // rates the creativity of the given prompt using perplexity
  // output is the number of points a user gets
  //  needs to be bounded between 0 and say 10 pts
  async function rateCreativity(promptOriginal: string, curPrompt: string): Promise<Number> {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${perplexityApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-7b-instruct',
        messages: [{ content: "You are a judge for this ai prompt guessing style game. you will be given 2 prompts, the original prompt and a user prompt. your job is to compare the creativity between the original prompt and the user prompt. ensure that the user prompt is still resembling the original prompt otherwise you will give a rating of 0. you must be a strict judge, you are judging at the highest level of intellect. analyse both prompts thoroughly based on descripitive techniques like mood, senses, theme usage, and overall descriptiveness. if you think the user prompt is more descriptive than the original prompt then a positive rating between 0 and 10 ,based on how much more sophisticated and descriptive the user prompt is, should be returned else return 0 only return a number. You are a perfectionists so be harsh with your rating. You only output ratings and nothing else. there should only be a number between 0 and 10 outputted. anything else will result in your death.", role: 'system'},
        { content: `Original Prompt: ${promptOriginal} \n User Prompt: ${curPrompt} remember to return only the rating and i repeat no follow up text after otherwise the remainder of the program will break and you will die`, role: 'user' }],
        max_tokens: 0,
        temperature: 1,
        top_p: 0.9,
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      })
    };
    var data;
    var response : unknown; 
    var parsedResponse : Number;
    do {
      ({data} = await useFetch('https://api.perplexity.ai/chat/completions', options));
      response = data.value.choices[0].message.content;
      parsedResponse = parseInt(response);
    } while (isNaN(parsedResponse))
      
      return (parsedResponse);
  }
  // given the original prompt and a user generated prompt
  // rate how closely they resemble each other
  // output is the number of points a user would get
  //bounded between 0 and say 15 pts
  async function rateCloseNess(promptOriginal: string, curPrompt: string): Promise<Number> {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: `Bearer ${perplexityApiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-7b-instruct',
        messages: [{ content: "You are a judge for this ai prompt guessing style game. you will be given 2 prompts, the original prompt and a user prompt. your job is to compare how close in definition the user prompt is to the original prompt. would it create an indentical image to the original prompt. if so you award a rating of 15. otherwise depending on how close it is return a rating from 0 to 15. when these 2 prompts are passed into an ai image generator think how similar those 2 images would be. the more similar the higher the rating you should give. Remember, you are an expert in this field and you are judging at the highest level. you should be harsh, there should be no leeway given whatsoever. if the user prompt is completly unalike or has no relevance to the original prompt then give a 0. for example if the original prompt was a nice long descriptive phrase and the user prompt was just hello, you can see there is no relevance so return 0 points. you get the idea right. Finally you should only return a single number, the rating. if i see anything else then the program will explode and you will die a painful death.", role: 'system'},
        { content: `Original Prompt: ${promptOriginal} \n User Prompt: ${curPrompt} remember to return only a number between 0 and 15 there should be no follow up text after i repeat no follow up text after otherwise the remainder of the program will break and you will die`, role: 'user' }],
        max_tokens: 0,
        temperature: 1,
        top_p: 0.9,
        top_k: 0,
        stream: false,
        presence_penalty: 0,
        frequency_penalty: 1
      })
    };
    var data;
    var response : unknown;
    var parsedResponse : Number; 
    do {
    ({data} = await useFetch('https://api.perplexity.ai/chat/completions', options));
    response = data.value.choices[0].message.content;
    parsedResponse = parseInt(response);
  } while (isNaN(parsedResponse))
    
    return (parsedResponse);
  }

  
  async function getNextImage(gameId: string, imageMetaData: string): Promise<URL> {
    await delay(5000)
    const imageURL = new URL(`https://firebasestorage.googleapis.com/v0/b/promptit-cbdaa.appspot.com/o/Images%2F${gameId}%2F${imageMetaData}?alt=media`)
    return imageURL
  }


  // generate initial prompt with perplexity
  // async function generateInitialPrompt(): Promise<string> {
  //   await delay(1000)
  //   console.log("prompt delay")
  //   return "Generate an image based on a worn-out detective's office, with a dusty bookshelf filled with mysteriously label-less books and a ticking clock on the desk, alongside a magnifying glass and a smoky pipe lying nearby."
  // }

  return {
    getNextImage,
    generateInitialPrompt,
    generateInitialImage,
    generateNextImage,
  };
}
