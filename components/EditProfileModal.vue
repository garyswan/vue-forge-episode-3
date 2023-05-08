<script setup lang="ts">
const emit = defineEmits(["close"]);
const onKeyup = (e: KeyboardEvent) => {
  if (e.key === "Escape") {
    emit("close");
  }
};
onMounted(() => {
  window.addEventListener("keyup", onKeyup);
});
onUnmounted(() => {
  window.removeEventListener("keyup", onKeyup);
});

const user = useSupabaseUser();

const avatar = computed(() => {
  if (user.value) {
    return user.value.user_metadata.avatar_url;
  }
  return "";
});

const displayName = ref<string>(user.value!.user_metadata.full_name);
const bio = ref<string>(user.value!.user_metadata.bio);
</script>

<template lang="pug">
.fixed.w-screen.h-screen.top-0.left-0.flex.justify-center.items-center.overflow-y-auto(class="bg-black/25")
  .bg-neutral-50.max-w-lg.w-full.relative.border.border-gray-300
    .absolute.right-2.top-2
      button.font-bold(@click="emit('close')")
        | X
    .flex.flex-col.items-center.p-4.gap-4
      img.w-32.h-32.object-cover.rounded-full(:src="avatar")
      input.input.w-full.shadow(type="text",placeholder="What is your display name?" v-model="displayName")
      textarea.input.w-full.shadow.h-40.py-2.resize-none(type="text",placeholder="Tell us about yourself")
      .flex.justify-end.w-full 
        button.button.bg-primary.text-white.font-bold.px-4.py-2.rounded-md(@click="emit('close')")
          | Save

</template>
