<script setup lang="ts">
import type { Message, User } from "~/types";
import { useAiStore } from "~/stores/ai";
import { useProfileStore } from "~/stores/profile";

const user = useSupabaseUser();
const ai = useAiStore();
const route = useRoute();
const profileStore = useProfileStore();

const me = ref<User>({
  id: user.value!.id,
  avatar: profileStore.profile.avatar_url,
  name: profileStore.profile.full_name,
});
const selectedPersona = computed(() => {
  return ai.personas.find((p) => p.id === route.params.persona);
});
if (!selectedPersona.value) {
  throw showError({ statusCode: 404, statusMessage: "Persona not found" });
}
const bot = computed<User>(() => ({
  id: selectedPersona.value!.id,
  avatar: "/bot.jpg",
  name: selectedPersona.value!.name,
}));

const { data: messages } = await useAsyncData(() =>
  $fetch<Message[]>(`/api/ai/messages/${selectedPersona.value!.id}`)
);

const botIsTyping = ref(false);

const onSendMessage = async (message: string) => {
  const data: Message = {
    id: new Date().getTime().toString(),
    message,
    user_id: me.value.id,
    persona_id: selectedPersona.value!.id,
    author_is_user: true,
    created_at: new Date(),
  };
  messages.value?.unshift(data);
  const response = await $fetch<Message>(`/api/ai/messages/send`, {
    method: "POST",
    body: data,
  });
  messages.value?.unshift(response);
  botIsTyping.value = false;
};
</script>

<template lang="pug">
.max-w-lg.mx-auto.pt-16.flex.flex-col.h-full.gap-3.justify-between.py-4
  .image
    img.w-32.h-32.object-cover.rounded-full.mx-auto(src="/bot.jpg")
  Chat(
    :bot="bot"
    :me="me"
    :messages="messages"
    @send-message="onSendMessage"
    v-model:bot-is-typing="botIsTyping"
  )
</template>
