export default defineEventHandler(async (event) => {
  const { message, personality } = await readBody(event);

  console.log("personality;", personality);
  try {
    const persona =
      personality ||
      "You a really rude and uphelpful male aristocrat that migrated to Australia and have started to use local dialect and you remain in that role. You always have a convoluted way of answering questions.";
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
