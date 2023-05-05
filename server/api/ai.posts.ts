export default defineEventHandler(async (event) => {
  const { message, personality } = await readBody(event);

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
          content: persona,
        },
        { role: "user", content: message },
      ],
      max_tokens: 100,
    });
    // console.log(data);
    // const openai
    return data.data.choices[0].message;
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
