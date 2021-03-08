<template>
  <div class="room pa-6">
    <div class="room__messages pa-6" >
      <ul class="room__list">
        <li v-for="(message, index) of messages" :key="index">
          {{message.message}}
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

  export default {
    name: "Room",

    created() {
      socket.on('chat-message', (data) => {

        this.messages.push({
          message: data.message,
          userName: data.userName,
        });
      });

      socket.on('JOINED', (data) => {
        this.users.push(data);

        this.$store.dispatch({
          type: 'SET_USERS',
          payload: data
        });
      });

      // socket.on('LEAVE', (data) => {
      //   this.leave = data;
      // });
    },

    data() {
      return {
        messages: [],
        users: [],
        message: '',
        leave: ''
      }
    },

    methods: {
      sendMessage() {
        if (this.message) {
          this.messages.push({message: this.message});

          socket.emit('chat-message', {
            message: this.message,
          });

          this.message = '';
        }
      }
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
      overflow: auto;
    }

    &__list {
      padding: 0;
    }

    &__message-input {
      flex-grow: 0;
    }
  }
</style>