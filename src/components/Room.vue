<template>
  <div class="room pa-6">
    <div class="room__messages pa-6" ref="messagesArea">
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

    <div class="room__input-wrap">
      <input type="file" ref="fileInput">
      <button class="room__btn" @click="encodeImageFileURL">
        Отправить
      </button>
    </div>
  </div>
</template>

<script>
  import socket from "@/socket";
  import { mapGetters } from 'vuex';

  export default {
    name: "Room",

    created() {
      socket.on('CHAT_MESSAGE', (data) => {
        console.log(data);
        this.messages.push(data)
      });

      socket.on('CHAT_IMAGE', (data) => {
        console.log(data);
        const image = document.createElement('img');
        image.src = data.img;
        document.body.append(image);
      });
    },

    data() {return {messages: [], message: ''}},

    methods: {
      sendMessage() {
        if (this.message) {
          socket.emit('CHAT_MESSAGE', {message: this.message, userName: this.USER_NAME});
          this.message = '';
        }
      },

      encodeImageFileURL() {
        fileSelect = this.$refs.fileInput.files;

        if (fileSelect.length > 0) {
          var fileSelect = fileSelect[0];
          var fileReader = new FileReader();

          fileReader.onload = function(FileLoadEvent) {
            var srcData = FileLoadEvent.target.result;
            socket.emit('CHAT_IMAGE', {img: srcData});
          }
          fileReader.readAsDataURL(fileSelect);
        }
      }
    },

    computed: {...mapGetters(['USERS', 'USER_NAME'])}

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
      position: relative;
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
      margin-top: 8px;
      flex-grow: 0;
    }

    &__attach-file {
      position: absolute;
      right: 65px;
      bottom: 35px;
      margin: 0;
    }

    &__input-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 0;
    }

    &__btn {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 35px;
      background: antiquewhite;
      border-radius: 22px;
      padding: 8px;
    }
  }
</style>