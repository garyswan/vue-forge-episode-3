<script setup lang="ts">
import { useAiStore } from "~/stores/ai";
const ai = useAiStore();
</script>

<template lang="pug">
.sidebar.py-8
  ul
    li.py-2(v-for="persona in ai.personas" :key="persona.id")
      NuxtLink.px-4.capitalize(:to="`/dashboard/${persona.id}`", exact-active-class="text-primary relative before:bg-primary before:h-full before:w-[1px] before:absolute before:left-0 before:top-0")
        | {{ persona.name }}
</template>
