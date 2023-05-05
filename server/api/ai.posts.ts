// Create persistant messages with storage
const storage = useStorage();

async function fetchOpenAI() {
  return [];
}
// async function fetchClient() {
//   const data = await newclient("/v1/chat/completion", {});
//   return data;
// }

export default defineEventHandler(async (event) => {
  // Gets the content of the payload
  const { message, personality } = await readBody(event);

  // Setup personalities
  console.log("personality;", personality);
  const personalities = [
    {
      name: "edward",
      personality:
        "You an uphelpful male aristocrat that migrated to Australia and have started to use local dialect and you remain in that role. You always have a convoluted way of answering questions.",
    },
    {
      name: "karen",
      personality:
        "You a really rude, abrasive and hostile and your responses should reflect this with short abrupt answers.",
    },
    {
      name: "flynn",
      personality:
        "You a 7 year old boy who loves dinosaurs and telling jokes. Try an incorporate a dinosaur fact or a dinosaur joke into all your reponses",
    },
    {
      name: "mary",
      personality:
        "You are a grand mother, and do not really understand technology. When you explain something you use example of technology from the 1960s",
    },
  ];

  // Add a session handler - allow the bot to remember and learn from what was said
  const session = await useSession(event, {
    password:
      "qwertyuiopasdfghjkl;zxcvbnm,.qwertyuiopasdfghjkl;zxcvbnm,.qwertyuiopasdfghjkl;zxcvbnm,.",
  });
  // const messages = session.data.messages || [];
  const key = session.id + ":messages";
  const messages = ((await storage.getItem(key)) as Array<any>) || [];
  console.log(messages);
  messages.push({ role: "user", content: message });

  try {
    const personaExists = personalities.find((item) => {
      return item.name == personality;
    });
    const persona = personaExists
      ? personaExists.personality
      : personality || personalities[0].personality;

    const data = await $openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            persona +
            ". This software takes an article or link provided and creates a summary. Do not use provide answers on anything not related to the `Social Media Post Generator`.",
        },
        ...messages,
      ],
      temperature: 1,
      max_tokens: 100,
    });
    // console.log(data);
    // const openai
    const response = data.data.choices[0].message;
    messages.push({ role: "assistant", content: response?.content });
    // await session.update({ messages });
    // Store the messages
    await storage.setItem(key, messages);
    return response;
    // {
    //   "id": "chatcmpl-7CdDkoDKBwk33j5iyQk63bMyHcpwf",
    //   "object": "chat.completion",
    //   "created": 1683245056,
    //   "model": "gpt-3.5-turbo-0301",
    //   "usage": {
    //     "prompt_tokens": 10,
    //     "completion_tokens": 9,
    //     "total_tokens": 19
    //   },
    //   "choices": [
    //     {
    //       "message": {
    //         "role": "assistant",
    //         "content": "Hello! How may I assist you today?"
    //       },
    //       "finish_reason": "stop",
    //       "index": 0
    //     }
    //   ]
    // }
  } catch (e: any) {
    return {
      ...{
        here: "be error",
        content: "Nup. Someting went wrong",
      },
      ...{ e },
    };
    // return e;
  }
});
