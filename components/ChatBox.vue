<script lang="ts" setup>
import { Message, User } from "~/types";

withDefaults(
  defineProps<{
    messages: Message[];
    users: User[];
    me: User;
    usersTyping?: User[];
  }>(),
  {}
);
</script>
<template lang="pug">
pre TODO: Code out the chatbox for Exercise 1 here
</template>
