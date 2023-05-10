import { Configuration, OpenAIApi } from "openai";

const config = useRuntimeConfig();
const openaiConfig = new Configuration({
  apiKey: config.openai.apiKey,
});
export const $openai = new OpenAIApi(openaiConfig);
// console.log("apiKey;", openaiConfig);

const dalleConfig = new Configuration({
  apiKey: config.openai.dalle,
});
export const $dalle = new OpenAIApi(openaiConfig);
// console.log("apiKey;", openaiConfig);
