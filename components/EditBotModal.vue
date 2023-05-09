<script setup lang="ts">
const props = defineProps<{
  bot: {
    name: string;
    description: string;
  };
  isLoading: boolean;
  isCreating: boolean;
}>();
const emit = defineEmits<{
  (event: "close"): void;
  (
    event: "save",
    bot: {
      name: string;
      description: string;
    }
  ): void;
  (event: "delete"): void;
}>();

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

const name = ref(props.bot.name);
const description = ref(props.bot.description);

const onSave = () => {
  emit("save", {
    name: name.value,
    description: description.value,
  });
};
</script>

<template lang="pug">
.fixed.w-screen.h-screen.top-0.left-0.flex.justify-center.items-center.overflow-y-auto(class="bg-black/25")
  .bg-neutral-50.max-w-lg.w-full.relative.border.border-gray-300
    .absolute.right-2.top-2
      button.font-bold(@click="emit('close')")
        | X
    .flex.flex-col.items-center.p-4.gap-4.mt-4
      input.input.w-full.shadow(type="text",placeholder="Enter / Edit name" v-model="name")
      textarea.input.w-full.shadow.h-40.py-2.resize-none(type="text",placeholder="Enter / update a description about your bot", v-model="description")
      .flex.justify-end.w-full.gap-4 
        button.button.border-rose-400.text-rose-400.border.font-bold.px-4.py-2.rounded-md.transition-colors(@click="emit(isCreating ? 'close' : 'delete')", :disabled="isLoading", class="hover:bg-rose-400 hover:text-white")
          | {{ isLoading ? 'Loading ...' : isCreating ? 'Cancel' :  'Delete' }}
        button.button.bg-primary.text-white.font-bold.px-4.py-2.rounded-md(@click="onSave", :disabled="isLoading")
          | {{ isLoading ? 'Loading ...' :  'Save' }}
</template>
