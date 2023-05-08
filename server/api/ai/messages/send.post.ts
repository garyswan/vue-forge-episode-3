import { serverSupabaseClient } from "#supabase/server";
import type { ChatCompletionRequestMessageRoleEnum } from "openai";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);

  const body = await readBody(event);
  delete body.id;
  delete body.created_at;

  const response = await client
    .from("messages")
    .upsert(body)
    .select("*")
    .single();
  if (response.error)
    throw createError({ statusCode: 500, message: response.error.message });

  const { data: messages } = await client
    .from("messages")
    .select("*")
    .eq("persona_id", body.persona_id)
    .order("created_at", { ascending: true });

  const { data: persona } = await client
    .from("personas")
    .select("description")
    .eq("id", body.persona_id)
    .single();
  if (!persona)
    throw createError({ statusCode: 500, message: "Persona not found" });

  const data = await $openai.createChatCompletion({
    model: "gpt-3.5-turbo",

    messages: [
      {
        role: "system",
        content:
          persona.description +
          `. This software provides a conversation with a child using an AI as a virtual friend. The Software will act like the Personality. The information provided is for children and must be appropriate for a person 8 years and younger. If any question is asked that is inappropirate the Software MUST recommended they talk with their mum and dad.`,
        // `. This software provides recipies to create a healthy meal plan. Do not recommend any meals or recipies with following food ingredients: ${excludeFood}. If you provide a recipie try and also provide to total kilojoules of the ingredients for an average adult male meal intake `,
      },
      {
        role: "assistant",
        content:
          persona.description +
          `. This software provides a conversation with a child using an AI as a virtual friend. The information provided is for children and must be appropriate for a person 8 years and younger.`,
        // `. This software provides recipies to create a healthy meal plan. Do not recommend any meals or recipies with following food ingredients: ${excludeFood}.`,
      },
      ...(messages as any[]).map((message) => ({
        role: (message.author_is_user
          ? "user"
          : "assistant") as ChatCompletionRequestMessageRoleEnum,
        content: message.message,
      })),
    ],

    temperature: 1,
    max_tokens: 100,
  });

  const gptResponse = data.data.choices[0].message;
  const message = await client
    .from("messages")
    .upsert({
      ...body,
      message: gptResponse?.content,
      author_is_user: false,
    })
    .select("*")
    .single();
  return message.data;
});
