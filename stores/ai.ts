import { SupabaseClient } from "@supabase/supabase-js";
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
      const { data, error } = await client.from("personas").select("*");
      if (error) throw error;
      this.personas = data as Persona[];
    },
  },
});
