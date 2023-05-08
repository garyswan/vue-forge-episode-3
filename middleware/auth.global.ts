export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();
  if (to.path !== "/") {
    if (!user.value && to.path !== "/login") {
      return navigateTo("/login");
    } else if (user.value && to.path == "/login") {
      return navigateTo("/dashboard");
    }
  }
});
