<template lang="pug">
div(class="max-w-full w-[900px] m-auto")
  NuxtErrorBoundary
    SocialMediaPostGenerator
    ChatWidget
    template(#error="{ error }")
      div
        p(class="text-4xl pt-10) ⚠️ A fatal error has occurred:")
        p {{ error }}
</template>
