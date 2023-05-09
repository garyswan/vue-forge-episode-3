import { skipHydrate } from "pinia";
import type { SupabaseClient } from "@supabase/supabase-js";

export const useProfileStore = defineStore("profile", {
  state: () => ({
    user: skipHydrate(useSupabaseUser()),
    profile: {
      full_name: "",
      bio: "",
      avatar_url: "",
    },
    isUpdating: false,
  }),
  // hydrate(state, initialState) {
  //   state.profile = initialState.profile;
  //   state.isUpdating = initialState.isUpdating;
  //   state.supabase = useSupabaseClient();
  // },
  actions: {
    async downloadImage(avatar_url: string, client: SupabaseClient) {
      try {
        const { data, error } = await client.storage
          .from("avatars")
          .download(avatar_url);
        if (error) throw error;
        this.profile.avatar_url = URL.createObjectURL(data);
      } catch (error: any) {
        console.error("Error downloading image: ", error.message);
      }
    },
    async fetchProfile(client: SupabaseClient) {
      if (!this.user) return;
      this.isUpdating = true;
      let { data } = await client
        .from("profiles")
        .select(`full_name, bio, avatar_url`)
        .eq("id", this.user!.id)
        .single();
      if (data) {
        this.profile = { ...data };
        this.profile.avatar_url = this.user!.user_metadata.avatar_url;
        await this.downloadImage(data.avatar_url, client);
      }
      this.isUpdating = false;
    },
  },
});
