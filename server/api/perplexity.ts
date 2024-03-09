// export default defineEventHandler(async (event) => {
//   const {} = useRuntimeConfig();
//   return $fetch('https://api.perplexity.ai/chat/completions', event.options);
// });
//


export default defineEventHandler(async (event) => {
  return {
    hello: "world"
  }
});
