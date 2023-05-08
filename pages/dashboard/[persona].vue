<script setup lang="ts">
import type { User } from "~/types";

const user = useSupabaseUser();

const me = ref<User>({
  id: user.value!.id,
  avatar: user.value!.user_metadata.avatar_url,
  name: user.value!.user_metadata.full_name,
});
const bot = ref<User>({
  id: "assistant",
  avatar: "/bot.jpg",
  name: "Dinnerbot",
});
</script>

<template lang="pug">
.max-w-lg.mx-auto.pt-16.flex.flex-col.h-full.gap-3.justify-between.py-4
  .image
    img.w-32.h-32.object-cover.rounded-full.mx-auto(src="https://via.placeholder.com/128x128")
  Chat(
    :bot="bot"
    :me="me"
    :messages="[]"
  )
</template>
