// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@vueuse/nuxt"],
  runtimeConfig: {
    openai: {
      apiKey: process.env.NUXT_OPENAI_API_KEY,
    },
  },
  ssr: false,
});
