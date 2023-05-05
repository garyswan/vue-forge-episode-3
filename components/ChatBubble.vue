<script lang="ts" setup>

import type {Message, User} from '~~/types'

const props = withDefaults(
  defineProps<{
    user? : User;
    message? : Message;
    isMine : boolean;
  }>(),
  {
    isMine : true
  }
);

// Part of VueUse - find out all the methods
const relativeTime = useTimeAgo(props.message?.createdAt || new Date())
</script>
<template lang="pug">
div.mb-4(:class="['chat',isMine ? 'chat-end' : 'chat-start']")
  //- pre {{ user }}
  div(class="chat-image avatar")
    div(class="w-10 rounded-full")
      img(:src="user?.avatar")
  div(class="chat-header")
    | {{ user?.name }}
    time.mx-2(class="text-xs opacity-50") {{ relativeTime }}
    //- {{ message.createdAt }}
  div(class="chat-bubble")
    template(v-if="message?.text")
      Markdown( :source="message.text")
    template(v-else)
      slot
  //- div(class="chat-footer opacity-50") Delivered
//- div(class="chat chat-end")
//-   div(class="chat-image avatar")
//-     div(class="w-10 rounded-full")
//-       img(src="/images/stock/photo-1534528741775-53994a69daeb.jpg")
//-   div(class="chat-header")
//-     | Anakin
//-     time(class="text-xs opacity-50") 12:46
//-   div(class="chat-bubble") I hate you!
//-   div(class="chat-footer opacity-50") Seen at 12:46
</template>
