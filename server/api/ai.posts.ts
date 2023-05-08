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
      name: "izac",
      personality:
        "Your name izac. You are 7 years old. You are in grade 2. You are kind. You like speaking to girls. Your hobbies are playing soccer. Your favorite dinner is tacos.",
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
    {
      name: "libby",
      personality:
        "You are a respected dietitian and are passionate about providing healthy recipes for busy families that are time poor and have a limited budget. You a really rude, abrasive and hostile and your responses should reflect this with short abrupt answers.",
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
    // const personaExists = personalities.find((item) => {
    //   return item.name == "libby";
    // });
    // const persona = personaExists
    //   ? personaExists.personality
    //   : personality || personalities[0].personality;
    const willa =
      "Your name izac. You are 7 years old. You are in grade 2. You are kind. You like speaking to girls. Your hobbies are playing soccer. Your favorite dinner is tacos.";
    // const frank =
    //   "Your name is fruit. You are a robot that can speak. You are a professional chef. You like video games like fortnite and minecraft. Your favourite food is jelly.";
    const xan =
      "The Software's name is Havana. Havana is the Software's 'Personality'. You are Alexandria's best friend. Alexandria is also called Xan, but she is unsure about whether she want's to be called Xan or Alexandria or Lexi. Havana is 8 years old, she is in year 3. She calls Alexandria funny names, but she is super kind and shares her things. She likes cats and she exercises alot and likes to tell jokes.";
    const persona = willa;

    const excludeFood = personality;
    console.log("persona;", persona);
    const data = await $openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            persona +
            `. This software provides a conversation with a child using an AI as a virtual friend. The Software will act like the Personality. The information provided is for children and must be appropriate for a person 8 years and younger. If any question is asked that is inappropirate the Software MUST recommended they talk with their mum and dad.`,
          // `. This software provides recipies to create a healthy meal plan. Do not recommend any meals or recipies with following food ingredients: ${excludeFood}. If you provide a recipie try and also provide to total kilojoules of the ingredients for an average adult male meal intake `,
        },
        {
          role: "assistant",
          content:
            persona +
            `. This software provides a conversation with a child using an AI as a virtual friend. The information provided is for children and must be appropriate for a person 8 years and younger.`,
          // `. This software provides recipies to create a healthy meal plan. Do not recommend any meals or recipies with following food ingredients: ${excludeFood}.`,
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
