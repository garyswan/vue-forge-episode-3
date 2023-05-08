<script setup lang="ts">
const personalities = ref([{ name: "Izac" }, { name: "Havana" }]);
</script>

<template lang="pug">
.sidebar.py-8
  ul
    li.py-2(v-for="persona in personalities")
      NuxtLink.px-4(:to="`/dashboard/${persona.name.toLowerCase()}`", exact-active-class="text-primary relative before:bg-primary before:h-full before:w-[1px] before:absolute before:left-0 before:top-0")
        | {{ persona.name }}
</template>
