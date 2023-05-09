import { serverSupabaseClient } from "#supabase/server";
import type { ChatCompletionRequestMessageRoleEnum } from "openai";

export default defineEventHandler(async (event) => {
  const { id: persona_id } = getRouterParams(event);
  const client = serverSupabaseClient(event);

  const { data: messages } = await client
    .from("messages")

    .select("message")
    .eq("persona_id", persona_id)
    .eq("author_is_user", false)
    .order("created_at", { ascending: false });

  const { data: persona } = await client
    .from("personas")
    .select("description, name")
    .eq("id", persona_id)
    .single();

  // return placeholder image
  if (!persona || !messages) return "https://via.placeholder.com/120";
  const data = await $openai.createChatCompletion({
    model: "gpt-3.5-turbo",

    messages: [
      {
        role: "system",
        content: `You are now a DALLE prompt generation tool that will generate a suitable prompt for user to generate a picture story based on the persona description and messages they sent, generate a prompt that gives the DALLE AI text to generate a picture model, please narrate in English and need to maintain a hand drawn style. Return the prompt with “” around the text. Limit 400 charters.`,
      },
      // {
      //   role: "assistant",
      //   content: `I am now a DALLE prompt generation tool that will generate a suitable prompt for you to generate a picture story based on the persona description and messages they sent, I'll generate a prompt that gives the DALLE AI text to generate a picture model. The prompt I give will be given to you with “” around the text. Prompt limit 400 charters.`,
      // },
      {
        role: "user",
        content: `Persona name: ${persona.name}, persona description: ${persona.description}`,
      },
      {
        role: "user",
        content: `Messages: ${messages
          .map((message) => message.message)
          .join("\n\n")}`,
      },
      {
        role: "system",
        content: `Prompt:`,
      },
    ],

    temperature: 1,
    max_tokens: 100,
  });

  const gptResponse = data.data.choices[0].message?.content;
  if (!gptResponse) return "https://via.placeholder.com/130";
  // get text inside ""
  const prompt = gptResponse.replace(/"/g, "");
  if (!prompt) return "https://via.placeholder.com/140";
  try {
    const response = await $dalle.createImage({
      prompt,
      n: 1,
      response_format: "url",
    });

    return response.data.data[0].url;
  } catch (error) {
    console.log(error);
    return "https://via.placeholder.com/150";
  }
});
