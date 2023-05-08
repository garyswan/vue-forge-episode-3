<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
const supabase = useSupabaseClient();
const profileStore = useProfileStore();

const emit = defineEmits(["close", "updated"]);

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

const loading = ref(true);

const user = useSupabaseUser();
if (!profileStore.profile) await profileStore.fetchProfile(supabase);

const avatar = ref<string>(profileStore.profile?.avatar_url);

const displayName = ref<string>(profileStore.profile?.full_name);
const bio = ref<string>(profileStore.profile?.bio);

loading.value = false;

async function updateProfile(saveAvatar = false) {
  try {
    loading.value = true;
    const user = useSupabaseUser();

    const updates: Record<string, any> = {
      id: user.value!.id,
      bio: bio.value,
      full_name: displayName.value,
      updated_at: new Date(),
    };
    if (saveAvatar) {
      updates.avatar_url = avatar.value;
    }

    let { error } = await supabase.from("profiles").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });
    if (error) throw error;
    if (saveAvatar) {
      await profileStore.fetchProfile(supabase);
    }
    avatar.value = profileStore.profile?.avatar_url;
  } catch (error) {
    alert(error.message);
  } finally {
    emit("updated");
    loading.value = false;
  }
}

const isLoading = computed(() => loading.value || profileStore.isUpdating);
</script>

<template lang="pug">
.fixed.w-screen.h-screen.top-0.left-0.flex.justify-center.items-center.overflow-y-auto(class="bg-black/25")
  .bg-neutral-50.max-w-lg.w-full.relative.border.border-gray-300
    .absolute.right-2.top-2
      button.font-bold(@click="emit('close')")
        | X
    .flex.flex-col.items-center.p-4.gap-4
      UploadAvatar(v-model:path="avatar" @upload="() => updateProfile(true)", :loading="isLoading")
      //- img.w-32.h-32.object-cover.rounded-full(:src="avatar")
      input.input.w-full.shadow(type="text",placeholder="What is your display name?" v-model="displayName")
      textarea.input.w-full.shadow.h-40.py-2.resize-none(type="text",placeholder="Tell us about yourself", v-model="bio")
      .flex.justify-end.w-full 
        button.button.bg-primary.text-white.font-bold.px-4.py-2.rounded-md(@click="updateProfile()", :disabled="isLoading")
          | {{ isLoading ? 'Loading ...' : 'Save' }}

</template>
