<script setup lang="ts">
import { nanoid } from "nanoid";
import type { Message, User } from "~~/types";

const me = ref<User>({
  id: "user",
  avatar: "/avatar.jpg",
  name: "You",
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Dinnerbot",
});

const users = computed(() => [me.value, bot.value]);

// {
//   text: "Hey, how's it going?",
//   id: nanoid(),
//   user_id: "user",
//   created_at: new Date(new Date().getTime() - 5 * 60000),
// },
// {
//   text: "**Great!** I'm building a cool chat app at Vue.js Forge 🔥",
//   id: nanoid(),
//   user_id: "assistant",
//   created_at: new Date(new Date().getTime() - 4 * 60000),
// },
// {
//   text: "Very cool! I'm so jealous 😀",
//   id: nanoid(),
//   user_id: "user",
//   created_at: new Date(new Date().getTime() - 2 * 60000),
// },
// {
//   text: "You can join me. Just visit the  [Vue.js Forge](https://vuejsforge.com/) website and sign-up. It's free!",
//   id: nanoid(),
//   user_id: "assistant",
//   created_at: new Date(),
// },
// const messages = ref<Message[]>([])
const messages = useSessionStorage<Message[]>("messages", []);

const usersTyping = ref<User[]>([]);

// send messages to Chat API here
// and in the empty function below

async function handleNewMessage(message: Message, personality?: String) {
  messages.value.push(message);
  usersTyping.value.push(bot.value);

  const res = await $fetch("/api/ai", {
    method: "POST",
    body: {
      message: message.message,
      personality: personality || undefined,
    },
  });
  setTimeout(() => {
    usersTyping.value = [];
    messages.value.push({
      id: nanoid(),
      created_at: new Date(),
      message: res.content,
      user_id: "assistant",
    });
  }, 3000);
}
</script>
<template lang="pug">
    
ChatBox(
  :me="me"
  :users="users"
  :messages="messages"
  @new-message="handleNewMessage"
  :usersTyping="usersTyping"
  )
  
</template>
