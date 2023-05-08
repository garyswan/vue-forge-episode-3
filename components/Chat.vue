<script setup lang="ts">
import type { Message, User } from "~~/types";
const props = defineProps<{
  bot: User;
  messages: Message[];
  me: User;
}>();

const botIsTyping = ref(false);
const textMessage = ref("");

const getUser = (userId: string) => {
  return props.bot.id == userId ? props.bot : props.me;
};

const sendMessage = () => {
  console.log("sendMessage");
};
</script>

<template lang="pug">
.ChatBox.bg-neutral-50.shadow-lg.rounded.border.transition-size.h-full.w-full(:class="['max-h-[500px] max-w-[32rem]']")
  //- div.fixed.bg-neutral-50.shadow-lg.rounded.p-8.border(class="h-[50vh] w-[32rem] bottom-[1rem] right-[1.5rem]")
  .overflow-auto.border.flex.flex-col.h-full(class="w-[32rem]")
    header.border.flex.h-20.items-center.bg-neutral-200.p-4
      p.text-xl.font-bold Say hello to {{bot.name}}
    //- Below uses a template ref
    #message-container.grow.overflow-auto.p-4(ref="messageBox")
      template(v-for="message in messages" :key="message.id")
        ChatBubble(:user="getUser(message.userId)",:message="message", :isMine="me.id == message.userId")
      template(v-if="botIsTyping") 
          AppLoading
      p.text-sm.mb-2.h-8(v-if="botIsTyping")
        span.italic {{`${bot.name} is typing ...`}}
      //- #ancor is here - This doesn't work - to set the message to boom
    //- footer.absolute.bottom-0.left-0.w-full.p-2.bg-neutral-100
    footer.w-full.p-2
      input.input.w-full.shadow(type="text",placeholder="Start typing ...",v-model="textMessage",@keypress.enter.exact.prevent="sendMessage")

</template>
