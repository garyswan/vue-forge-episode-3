<script setup lang="ts">
const user = useSupabaseUser();
const avatar = computed(() => {
  if (user.value) {
    return user.value.user_metadata.avatar_url;
  }
});

const isEditing = ref(false);
const bodyClass = computed(() => (isEditing.value ? "overflow-hidden" : ""));
useHead({
  bodyAttrs: {
    class: bodyClass,
  },
});
</script>
<template lang="pug">
.h-16.bg-gray-100.flex.items-center.px-4.justify-end
  a(href="#" @click.prevent="isEditing = true")
    img(:src="avatar" class="w-8 h-8 rounded-full")
  Teleport(v-if="isEditing" to="body")
    EditProfileModal(@close="isEditing = false")
</template>
