<template>
  <div class="room pa-6">
    <div class="room__messages pa-6" >
      <ul class="room__list">
        <li v-for="(message, index) of messages" :key="index">
          {{message.userName}}: {{message.message}}
        </li>
      </ul>
    </div>

    <v-text-field
        class="room__message-input"
        v-model="message"
        @click:append-outer="sendMessage"
        @keydown.enter="sendMessage"
        :append-outer-icon="'mdi-send'"
        filled
        clear-icon="mdi-close-circle"
        clearable
        hide-details
        label="Message"
        type="text"
    />
  </div>
</template>

<script>
  import socket from "@/socket";
  import { mapGetters } from 'vuex';

  export default {
    name: "Room",

    created() {
      socket.on('CHAT_MESSAGE', (data) => this.messages.push(data));
    },

    data() {
      return {messages: [], message: ''}
    },

    methods: {
      sendMessage() {
        if (this.message) {
          socket.emit('CHAT_MESSAGE', {message: this.message, userName: this.USER_NAME});
          this.message = '';
        }
      }
    },

    computed: {
      ...mapGetters(['USERS', 'USER_NAME'])
    }
  }
</script>

<style scoped lang="scss">
  .room {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__messages {
      height: 80vh;
      border: 1px solid;
      border-radius: 7px;
      overflow: auto;
    }

    &__list {
      padding: 0;
      li {
        background: antiquewhite;
        padding: 8px;
        border-radius: 7px;
      }
      li:nth-child(n + 2) {
        margin-top: 8px;
      }
    }

    &__message-input {
      flex-grow: 0;
    }
  }
</style>