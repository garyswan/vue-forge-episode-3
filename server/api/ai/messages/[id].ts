import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const client = serverSupabaseClient(event);
  const { id: persona_id } = getRouterParams(event);

  const { data } = await client
    .from("messages")
    .select("*")
    .eq("persona_id", persona_id)
    .order("created_at", { ascending: false });

  return data || [];
});
