<script lang="ts" setup>
// https://vi.to/hubs/vuejs-forge/pages/vue-js-forge-episode-3-day-1-2093dcea-2148-4d27-a55b-4aacf1cf7069?v=%2Fvideos%2F6316
// Lesson 1: TODO: 03:03

import { nanoid } from "nanoid";
import type { Message, User } from "~~/types";

const props = withDefaults(
  defineProps<{
    messages: Message[];
    users: User[];
    me: User;
    usersTyping?: User[];
  }>(),
  {}
);

// Toggle the chatbox open/close
const isOpen = ref(true);
// Get the user information
const getUser = (user_id: string) => {
  return props.users.find((item) => {
    return item.id == user_id;
  });
};
// Add interactions with the input field
const emit = defineEmits<{
  (
    event: "newMessage",
    newMessage: Message,
    personality: String | undefined
  ): void;
}>();
const textMessage = ref("");
const personality = ref(undefined);
const sendMessage = () => {
  emit(
    "newMessage",
    {
      id: nanoid(),
      user_id: props.me.id,
      created_at: new Date(),
      message: textMessage.value,
    },
    personality.value
  );
  textMessage.value = "";
};
// Scroll to bottom of page
// user marked instead
const messageBox = ref<HTMLElement>();
watch(
  () => props.messages.length,
  async () => {
    await nextTick();
    if (messageBox.value)
      messageBox.value.scrollTop = messageBox.value.scrollHeight;
  }
);

// Users typing
const usersTypingTest = computed(() => {
  if (props.usersTyping?.length === 1)
    return `${props.usersTyping[0].name} is typing ...`;
  if (props.usersTyping?.length > 1)
    return `${props.usersTyping
      ?.map((item) => {
        return item.name;
      })
      .join(",")} are typing ...`;
  return "";
});

function clearPersonality() {
  personality.value = undefined;
}
const personalityBox = ref(false);
function togglePersonality() {
  personalityBox.value = !personalityBox.value;
}

const botname = "TODO: useState";
</script>
<template lang="pug">
div
  p Supply a list of food that you CANNOT eat
  div
    textarea.input.border.shadow.mt-4(placeholder="Enter a short description",:class="['w-[32rem] h-[8rem]',{'bg-neutral-100' : personalityBox}]", v-model="personality", :readonly="personalityBox")
    //- div.italic.text-neutral-400 You can use some predefined personas by just typing "mary", "flynn", "karen" or the default "edward"
  .flex.gap-2.mt-2
    button.rounded.bg-blue-400.h-12.px-4.text-white.font-bold(@click="togglePersonality()", class="w-[6rem]")
        span(v-if="personalityBox") Edit
        span(v-else) Save

    button.rounded.bg-rose-400.h-12.px-4.text-white.font-bold(@click="clearPersonality()",class="w-[6rem]") Clear 
.ChatBox.fixed.bg-neutral-50.shadow-lg.rounded.border.transition-size.h-full.w-full(:class="['bottom-[1rem] right-[1.5rem]', !isOpen ? 'max-h-[4.5rem] max-w-[4.5rem]' : 'max-h-[60vh] max-w-[32rem]']")
  //- div.fixed.bg-neutral-50.shadow-lg.rounded.p-8.border(class="h-[50vh] w-[32rem] bottom-[1rem] right-[1.5rem]")
  .overflow-auto.border.flex.flex-col.h-full(class="w-[32rem]")
    header.border.flex.h-20.items-center.bg-neutral-200.p-4
      p.text-xl.font-bold Say hello to {{botname}}
    //- Below uses a template ref
    #message-container.grow.overflow-auto.p-4(ref="messageBox")
      template(v-for="message in messages" :key="message.id")
        ChatBubble(:user="getUser(message.user_id)",:message="message", :isMine="me.id == message.user_id")
      template(v-for="user in usersTyping" :user="user") 
          AppLoading
      p.text-sm.mb-2.h-8
        span.italic {{usersTypingTest}}
      //- #ancor is here - This doesn't work - to set the message to boom
    //- footer.absolute.bottom-0.left-0.w-full.p-2.bg-neutral-100
    footer.w-full.p-2
      input.input.w-full.shadow(type="text",placeholder="Start typing ...",v-model="textMessage",@keypress.enter.exact.prevent="sendMessage")
  //- Chat window
  //- div.relative(class="min-h-[3.5rem]")
  //-   pre {{isOpen}} here be window
  //- Toggle modal button
  button.bg-blue-600.p-3.rounded.absolute.top-0.right-0.m-4(@click="isOpen = !isOpen")
    IconChat(v-if="!isOpen").w-8.h-8.text-white
    template(v-else)
      div.w-8.h-8.text-white V


//-   //- div.overflow-auto
//-   //-   hr 
//-   //-   pre {{ messages }}
//-   //-   pre {{ users }}
//-   //-   pre {{ me }}
//-   //-   pre {{ usersTyping }}
    
</template>
<style lang="css">
/* this doesn't scroll */
/* #message-container * {
  overflow-anchor: none;
  background:red;
}
#anchor {
  overflow-anchor: auto;
  height: 1px;
} */
</style>
