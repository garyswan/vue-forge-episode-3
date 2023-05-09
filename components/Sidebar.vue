<script setup lang="ts">
import { useAiStore } from "~/stores/ai";
const ai = useAiStore();

const isEditing = ref(false);
const isUpdating = ref(false);
const createPersona = async () => {
  isEditing.value = true;
};
const onSaveBot = async (bot: { name: string; description: string }) => {
  isUpdating.value = true;
  const persona = await ai.createPersona(bot, useSupabaseClient());
  if (persona) {
    useRouter().push(`/dashboard/${persona.id}`);
  }
  isEditing.value = false;
  isUpdating.value = false;
};
</script>

<template lang="pug">
.sidebar.py-8
  ul
    template(v-for="persona in ai.personas" :key="persona.id")
      li.py-2()
        NuxtLink.px-4.capitalize(:to="`/dashboard/${persona.id}`", exact-active-class="text-primary relative before:bg-primary before:h-full before:w-[1px] before:absolute before:left-0 before:top-0")
          | {{ persona.name }}
    li.py-2
      a.px-4.capitalize(href="#", @click.prevent="createPersona")
        | Create new persona
  Teleport(v-if="isEditing",to="body")
    EditBotModal(:bot="{name: '', description: ''}", @save="onSaveBot", @close="isEditing = false", :is-loading="isUpdating", is-creating)
    
</template>
