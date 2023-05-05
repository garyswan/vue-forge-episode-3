<script lang="ts" setup>

import { marked } from 'marked';

const props = withDefaults(defineProps<{
  source : string
}>(),{
  source : ''
})
const markdown = computed(()=>{return marked.parse(props.source)})
</script>

<template lang="pug">
div(v-html="markdown")
//- pre {{ markdown }}
</template>

