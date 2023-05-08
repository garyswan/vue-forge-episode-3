<script lang="ts" setup>
import { useProfileStore } from "@/stores/profile";
const profile = useProfileStore();
profile.fetchProfile();
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
