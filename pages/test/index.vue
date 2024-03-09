<template>
  <div>
    <h1>Test</h1>
  </div>
  <div>
    <p v-if="pending">Fetching...</p>
    <pre v-else-if="error">Could not load quote: {{ error.data }}</pre>
    <figure v-else class="quote">
      {{ data }}
    </figure>
  </div>
</template>

<script setup lang="ts">
const options = {
  method: 'POST',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    authorization: 'Bearer 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'
  },
  body: JSON.stringify({
    model: 'mistral-7b-instruct',
    messages: [{ content:"Be concise, the prompt you generate is to be fed to an image generation AI. This will then be used in a game to get players to guess what your description and earn points. Therefore, do not make the scene overly complicated and stick to a few objects and points of interest. Keep it to 2 sentences, and write in plain layman english.", role: 'system' },
    { content: "Generate a description for an intriguing image, with a few points of interest and do not over complicate the scene, as it should be fairly easy for a human to guess the image's description. For example: these ideas can range from common games, landscapes, people, cities, objects, cars, fantasies, comics, etc. Try to evoke a specific emotion (e.g., A sense of wonder and discovery, a feeling of peace and serenity, a touch of mystery and intrigue). Start your message with something along the lines of 'Generate an image based on'.", role: 'user' }],
    max_tokens: 0,
    temperature: 0.2,
    top_p: 0.9,
    top_k: 0,
    stream: false,
    presence_penalty: 0,
    frequency_penalty: 1
  })
};

// const { data , pending, error } = await useFetch('https://api.perplexity.ai/chat/completions', options);

async function getRequest() {
  let newPrompt = ""

  const { data, error } = await useFetch('/api/perplexity', options);
  console.log("Data from Perp: " + data);
  console.log(data.value);
  console.log(error.value);
}
</script>
