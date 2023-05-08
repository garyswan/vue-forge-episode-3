export const useProfileStore = defineStore("profile", {
  state: () => ({
    profile: {
      full_name: "",
      bio: "",
      avatar_url: "",
    },
    isUpdating: false,
  }),
  actions: {
    async downloadImage(avatar_url: string) {
      const supabase = useSupabaseClient();
      try {
        const { data, error } = await supabase.storage
          .from("avatars")
          .download(avatar_url);
        if (error) throw error;
        this.profile.avatar_url = URL.createObjectURL(data);
      } catch (error: any) {
        console.error("Error downloading image: ", error.message);
      }
    },
    async fetchProfile() {
      this.isUpdating = true;
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();
      let { data } = await supabase
        .from("profiles")
        .select(`full_name, bio, avatar_url`)
        .eq("id", user.value!.id)
        .single();
      if (data) {
        this.profile = { ...data };
        this.profile.avatar_url = user.value!.user_metadata.avatar_url;
        await this.downloadImage(data.avatar_url);
      }
      this.isUpdating = false;
    },
  },
});
