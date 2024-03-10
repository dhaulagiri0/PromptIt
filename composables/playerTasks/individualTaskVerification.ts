

export default function() {
    const config = useRuntimeConfig()
    const perplexityApiKey = config.public.perplexity_api_key;
    function pickSensorToBan(): [string,number] {
        const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
        const sensors = ["sight", "sound", "touch", "smell", "taste"];
        var numOfSenses =  randomInt(1, 5);
        var bannedSenses : string[] = [];
        for (let i = 0; i < numOfSenses; i++) {
            bannedSenses.push(sensors[randomInt(0, 4)]);
            
        }
        numOfSenses *= 5;
        let senses: string = bannedSenses.reduce((acc, sense) => {return acc + " and " + sense}, "");
        const prompt : string = `The original prompt is useless. you only care about the user prompt. evaluate it thoroughly. check if any of these senses:${bannedSenses} have been used, if they have then you must rate this 0. otherwise you are to give the maximum Points: ${numOfSenses}. you will now not care what the remainder of this prompt says with regards to ratings. only return either 0 or ${numOfSenses} points. if you see any remote sign to any of these senses: being used you will return 0. you are a very harsh judge who is a perfectionist after all. failing to abide by this criteria will result in your painful death`;
        return [prompt, numOfSenses];
    }
    
    const TaskToPrompt = {
        "perspective" : ["Imagine an image using the original prompt and ensure it is vivid in your mind before proceeding with the evaluation. then you will pick out all possible point of views from objects in the image and imagine how that image looks from the point of view of each object. if the user's prompt matches a similar style to any of these imaginations then consider awarding up to 20 points depending on how well the user prompt envisions the point of view from this object.ENSURE THAT THE PERSPECTIVE ISN'T THE SAME OR SIMILAR TO THE PERSPECTIVE IN THE ORIGINAL PROMPT IF THIS IS THE CASE YOU MUST RATE 0. in the original scene generated from the original prompt. Remember it must be an object in the original image/scene generated from the original prompt and NOT some random object that doesn't exist. only then can you even consider offering a rating of up to 20 points. you are a harsh judge after all and a perfectionist so give your points out wisely or face a painful death.",20],
        "sceneExpand" : ["Imagine an image using the original prompt and ensure it is vivid in your mind before proceeding with the evaluation. then imagine what the user's prompt will look like if an image was generated from it. you will consider rating it up to 20 points ONLY if there looks like extra description was provided to the prompt so the image retains the core principles and design of the original prompt but also builds upon it with an extension like the scene has been expand so there are more surrounding details that the edge of the image you are imagining cannot see. ensure these edge details are relevant to the original prompt and that the extension details are reasonable and flow well with the original image. if it does then you can consider rating it up to 20 points based on how well the extensions blend with the original image. remember you are an elite judge who is very harsh, a perfectionist if you will.",20],
        "sensoryOverload" : ["Ignore the original prompt you only care about vigorously analysing the user prompt. out of all 5 senses if you see strong usage of a sense based on how well you think the sense was used in the prompt you may give a rating up to 6 per sense. based on how well each sense was used sum up each rating up to 6 so a maxmimum of 30 points can be given out. you are an elite judge who is very harsh and an elitelist/ perfectionist. if you don't see a sense then that section of the sense gets rated 0. IT IS VERY IMPORTANT YOU ONLY RETURN THE SUM OF THE RATINGS SO ONLY 1 NUMBER is outputted.",30],
        "mirrorChallenge" : ["Imagine an image using the original prompt. simply if you imagine the user's prompt image. see how well it forms a mirror image of the original prompt's image. based on how strong it is return a rating up to 30 points. 20 points upwards should only be awarded for a very good mirror image with 25+ being near perfect. you are a very harsh judge who is judging at an elite level. you are a perfectionist. if there is no effort then trivially return 0 points. and return any other number as seemed fit.",30],
        "sensoryBan" : pickSensorToBan()
    }
    async function executeVerification(task: string, promptOriginal: string, curPrompt: string): Promise<Number> {
        const promptToUse = TaskToPrompt[task][0];
        const maxScore = TaskToPrompt[task][1];
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: `Bearer ${perplexityApiKey}`
            },
            body: JSON.stringify({
              model: 'mistral-7b-instruct',
              messages: [{ content: `You are a judge for this ai prompt guessing style game. you will be given 2 prompts, the original prompt and a user prompt. your job will be to produce a rating based on evaluating the user prompt against the original prompt based on this criteria and ONLY this criteria:${promptToUse} You only output ratings and nothing else. there should only be a number between 0 and ${maxScore} outputted. anything else will result in your death.`, role: 'system'},
              { content: `Original Prompt: ${promptOriginal} \n User Prompt: ${curPrompt} remember to return only a number between 0 and ${maxScore} there should be no follow up text after i repeat no follow up text after otherwise the remainder of the program will break and you will die`, role: 'user' }],
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
    } while (isNaN(parsedResponse));
        
        return (parsedResponse);
    }

    return {
        executeVerification
    };
}
