<script setup lang="ts">
import type { Message, User } from "~/types";
import { useAiStore } from "~/stores/ai";
import { useProfileStore } from "~/stores/profile";

const user = useSupabaseUser();
const ai = useAiStore();
const route = useRoute();
const profileStore = useProfileStore();
const supabase = useSupabaseClient();

const me = ref<User>({
  id: user.value!.id,
  avatar: profileStore.profile.avatar_url,
  name: profileStore.profile.full_name,
});
const selectedPersona = computed(() => {
  return ai.personas.find((p) => p.id === route.params.persona);
});
if (!selectedPersona.value) {
  useRouter().push("/dashboard");
}
const bot = computed<User>(() => ({
  id: selectedPersona.value?.id || "null",
  avatar: "/bot.jpg",
  name: selectedPersona.value?.name || "Bot",
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

const isEditing = ref(false);
const isUpdating = ref(false);
const editBot = () => {
  isEditing.value = true;
};
const onSaveBot = async (bot: { name: string; description: string }) => {
  isUpdating.value = true;
  await ai.updatePersona(selectedPersona.value!.id, bot, supabase);
  isEditing.value = false;
  isUpdating.value = false;
};
const onDeletedBot = async () => {
  isUpdating.value = true;
  await ai.deletePersona(selectedPersona.value!.id, supabase);
  useRouter().push("/dashboard");
  isEditing.value = false;
  isUpdating.value = false;
};
</script>

<template lang="pug">
.max-w-lg.mx-auto.pt-16.flex.flex-col.h-full.gap-3.justify-between.py-4
  .image.cursor-pointer.w-32.h-32.mx-auto(@click="editBot")
    img.w-full.h-full.object-cover.rounded-full.mx-auto(src="/bot.jpg")
  Chat(
    :bot="bot"
    :me="me"
    :messages="messages"
    @send-message="onSendMessage"
    v-model:bot-is-typing="botIsTyping"
  )
  Teleport(v-if="isEditing",to="body")
    EditBotModal(:bot="{...selectedPersona}", @save="onSaveBot", @close="isEditing = false", @delete="onDeletedBot", :is-loading="isUpdating")
</template>
