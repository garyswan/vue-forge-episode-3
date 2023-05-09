import { SupabaseClient } from "@supabase/supabase-js";
import { useProfileStore } from "./profile";
interface Persona {
  id: string;
  user_id: string;
  name: string;
  description: string;
}

export const useAiStore = defineStore("ai", {
  state: () => ({
    personas: [] as Persona[],
  }),
  actions: {
    async fetchPersonas(client: SupabaseClient) {
      const useProfile = useProfileStore();
      if (!useProfile.user) return;
      const { data, error } = await client
        .from("personas")
        .select("*")
        .eq("user_id", useProfile.user.id);
      if (error) throw error;
      this.personas = data as Persona[];
    },
    async updatePersona(
      id: string,
      data: { name: string; description: string },
      client: SupabaseClient
    ) {
      const { error } = await client
        .from("personas")
        .update({ ...data, updated_at: new Date() })
        .eq("id", id);
      if (error) throw error;
      await this.fetchPersonas(client);
    },
    async deletePersona(id: string, client: SupabaseClient) {
      const data = await client.from("personas").delete().eq("id", id);
      if (data.error) throw data;
      await this.fetchPersonas(client);
    },
    async createPersona(
      data: { name: string; description: string },
      client: SupabaseClient
    ) {
      const useProfile = useProfileStore();
      if (!useProfile.user) return;
      const { error, data: response } = await client
        .from("personas")
        .upsert({ ...data, user_id: useProfile.user.id })
        .select("id")
        .single();
      if (error) throw error;
      useRouter().push("/dashboard/");
      await this.fetchPersonas(client);
      return response;
    },
  },
});
