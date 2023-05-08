<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();

const avatar = ref<string>(user.value?.user_metadata.avatar_url);

const downloadImage = async () => {
  const { data: d } = await supabase
    .from("profiles")
    .select(`avatar_url`)
    .eq("id", user.value!.id)
    .single();
  if (!d?.avatar_url) return;
  try {
    const { data, error } = await supabase.storage
      .from("avatars")
      .download(d?.avatar_url);
    if (error) throw error;
    avatar.value = URL.createObjectURL(data);
  } catch (error: any) {
    console.error("Error downloading image: ", error.message);
  }
};
downloadImage();

</script>
