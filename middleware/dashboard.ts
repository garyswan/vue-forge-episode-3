import { useAiStore } from "~/stores/ai";
export default defineNuxtRouteMiddleware(async (to, from) => {
  const ai = useAiStore();
  if (ai.personas.length === 0) {
    await ai.fetchPersonas(useSupabaseClient());
  }
  if (to.name == "dashboard") {
    return navigateTo("/dashboard/" + ai.personas[0].id);
  }
});
