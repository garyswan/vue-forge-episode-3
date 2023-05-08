<script lang="ts" setup>
import { useProfileStore } from "@/stores/profile";
import { useAiStore } from "./stores/ai";
const client = useSupabaseClient();

const profile = useProfileStore();
await profile.fetchProfile(client);
const ai = useAiStore();
await ai.fetchPersonas(client);
</script>
<template>
  <NuxtLayout>
    <NuxtErrorBoundary>
      <!-- <SocialMediaPostGenerator />
      <ChatWidget /> -->

      <NuxtPage />
      <template #error="{ error }">
        <div>
          <p class="text-4xl pt-10">⚠️ A fatal error has occurred:</p>
          <p>{{ error }}</p>
        </div>
      </template>
    </NuxtErrorBoundary>
  </NuxtLayout>
</template>
