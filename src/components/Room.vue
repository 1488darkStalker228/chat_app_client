<template>
  <div class="room pa-3">
    <div class="room__messages pa-7 scroll-style" ref="messageArea">
      <ul class="room__list">
        <li
          v-for="(message, index) of messages"
          :key="index"
          :class="message.userName === USER_NAME ? 'from-me' : 'from-them'"
        >
          <div>
            {{message.userName}}: {{message.message}}
          </div>
          <img
            class="room__img"
            alt=""
            :src="message.src"
            v-if="message.src"
          />
        </li>
      </ul>
    </div>

    <div
      class="room__scroll-bottom"
      @click="scrollBottom"
    >
      <ArrowDown/>
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
    </div>
  </div>
</template>

<script>
  import socket from "@/socket";
  import { mapGetters } from 'vuex';
  import ArrowDown from '../assets/ArrowDown.vue';

  export default {
  components: { ArrowDown },
    name: "Room",

    created() {
      socket.on('CHAT_MESSAGE', (data) => this.messages.push(data));

      socket.on('CHAT_IMAGE', (data) => {
        if (data.message) this.messages.splice(this.messages.length - 1, 1);
        this.messages.push(data);
      });
    },

    data() {return {messages: [], message: ''}},

    methods: {
      sendMessage() {
        this.encodeImageFileURL();

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

          const tmp = this.message;
          const tmp1 = this.USER_NAME;

          fileReader.onload = function(FileLoadEvent) {
            var srcData = FileLoadEvent.target.result;

            socket.emit('CHAT_IMAGE', {
              message: tmp,
              userName: tmp1,
              src: srcData
            });
          }
          fileReader.readAsDataURL(fileSelect);
        }
        this.$refs.fileInput.value = null;
      },

      scrollBottom() {
   /*      if (this.$refs.messageArea.scrollTop > 20) {
          alert('check')
        } */
        this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
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
      position: relative;
      height: 76vh;
      margin-bottom: 16px;
      border: 1px solid;
      border-radius: 7px;
      overflow-y: scroll;
    }

    &__list {
      display: flex;
      flex-direction: column;
      min-height: 100%;
      padding: 0;
      li {
        max-width: 540px;
        word-wrap: break-word;
        line-height: 24px;
        position: relative;
        padding: 10px 20px;
        border-radius: 25px;
        &:before, &:after {
          content: "";
          position: absolute;
          bottom: 0;
          height: 25px;
        }
      }
      li:nth-child(n + 2) {
        margin-top: 12px;
      }
    }

    .from-me {
      color: white;
      background: #0B93F6;
      align-self: flex-end;
      &:before {
        right: -7px;
        width: 20px;
        background-color: #0B93F6;
        border-bottom-left-radius: 16px 14px;
      }
      &:after {
        right: -26px;
        width: 26px;
        background-color: white;
        border-bottom-left-radius: 10px;
      }
    }

    .from-them {
      background: #E5E5EA;
      color: black;
      align-self: flex-start;
        
      &:before {
        left: -7px;
        width: 20px;
        background-color: #E5E5EA;
        border-bottom-right-radius: 16px 14px;
      }

      &:after {
        left: -26px;
        width: 26px;
        background-color: white;
        border-bottom-right-radius: 10px;
      }
    }

    &__img {
      max-width: 500px;
      max-height: 300px;
    }

    &__message-input {
      flex-grow: 0;
    }

    &__input-wrap {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 0;
    }

    &__scroll-bottom {
      position: absolute;
      right: 45px;
      bottom: 182px;
      svg {
        width: 50px;
        height: 50px;
        cursor: pointer;
      }
    }

    .scroll-style {
      &::-webkit-scrollbar {
        width: 4px;
      }
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      &::-webkit-scrollbar-thumb {
        background: rgba(153, 194, 248, 0.63);
        border-radius: 15px;
      }
    }
  }
</style>





