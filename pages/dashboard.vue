<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: [
    function (to, from) {
      if (to.name == "dashboard") {
        return navigateTo("/dashboard/izac");
      }
    },
  ],
});
</script>
<template lang="pug">
div.h-full.flex-1.grid
  .grid.grid-cols-6.h-full
    .col-span-1
      Sidebar
    .col-span-4.col-start-2
      NuxtPage
</template>
