<script lang="ts" setup>
definePageMeta({
  middleware: [
    function (to, from) {
      return navigateTo("/dashboard");
    },
  ],
});
</script>

<template>
  <div></div>
</template>
