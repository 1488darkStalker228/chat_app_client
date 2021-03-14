<template>
  <div class="room pa-3">
    <div
      class="room__messages pa-7 scroll-style"
      ref="messageArea"
      @scroll="getScrollTop"
    >
      <ul class="room__list">
        <li
          v-for="(message, index) of messages"
          :key="index"
          :class="message.userName === USER_NAME ? 'from-me' : 'from-them'"
          @click="showDeleteButton(index)"
        >
          <div class="room__message-text" ref="messageText">
            {{message.userName}}: {{message.message}}
          </div>
          <div
            class="room__message-delete"
            @click="removeMessage(index)"
            :class="message.userName === USER_NAME ? 'room__message-delete_me' : 'room__message-delete_them'"
            ref="remove"
          >
            <Delete/>
          </div>
          <img
            class="room__img"
            alt=""
            :src="message.src"
            v-if="message.src"
          />
        </li>
      </ul>

      <div class="room__images-previews">
        <div class="room__images-previews__item" v-if="imagesPreview">
          <img :src="imagesPreview" alt=""/>
          <div class="room__images-previews__item__remove-btn" @click="removeImageFromPreviews">&#10006;</div>
        </div>
      </div>

      <div
          class="room__sticker-wrapper"
          v-show="isVisibleStickers"
      >
        <img
            v-for="(sticker, index) of stickers"
            @click="sendSticker"
            :key="index"
            :src="require('../../assets/stickers/' + sticker)"
            alt=""
        >
      </div>
    </div>

    <div
        class="room__scroll-bottom"
        @click="scrollBottom"
        :class="{'room__scroll-bottom_show' : isVisibleButtonDown}"
    >
      <v-btn
          color="primary"
          elevation="3"
          raised
      >Вниз</v-btn>
    </div>

    <div class="room__input-wrapper">
      <input
        @change="addImageToPreview"
        style="display: none"
        id="input"
        type="file"
        ref="fileInput"
      >
      <label for="input">
        <Attach/>
      </label>
    </div>

    <v-textarea
      class="room__textarea"
      v-model="message"
      @click:append-outer="sendMessage"
      @click:prepend-inner="isVisibleStickers = !isVisibleStickers"
      @keydown="sendMessage"
      @keyup="sendMessage"
      append-outer-icon="mdi-send"
      prepend-inner-icon="mdi-sticker-plus"
      label="Сообщение"
      hide-details
      rows="4"
      no-resize
    />
  </div>
</template>

<script>
  import socket from "@/socket";
  import { mapGetters } from 'vuex';
  import Attach from "@/assets/Attach.vue";
  import Delete from '../../assets/Delete.vue';

  export default {
    name: "Room",

    components: {Attach, Delete},

    created() {
      socket.on('SEND_MESSAGE', (data) => this.messages.push(data));

      socket.on('SEND_IMAGE', (data) => this.messages.push(data));

      socket.on('SEND_STICKER', (data) => this.messages.push(data));
    },

    data() {
      return {
        isShift: false,
        messages: [],
        message: '',
        imagesPreview: undefined,
        isVisibleButtonDown: false,
        isVisibleStickers: false,
        currentScrollTop: 0,
        stickers: [
          '12669-150x150.png',
          '12670-150x150.png',
          '12671-150x150.png',
          '12673-150x150.png',
          '12674-150x150.png'
        ]
      }
    },

    methods: {
      sendMessage(e) {
        if(e.key === 'Shift') {
          this.isShift = e.type !== 'keyup';
          return;
        }
        if(e.type === 'keydown' && e.key === 'Enter' && this.isShift) {
          return;
        }
        if(e.type === 'keydown' && e.key === 'Enter' && !this.isShift) {
          e.preventDefault();
          if (!this.imagesPreview && this.message.trim()) {
            socket.emit('SEND_MESSAGE', {
              message: this.message,
              userName: this.USER_NAME
            });
            this.message = '';
          }
        }
      },

      sendSticker(e) {
        socket.emit('SEND_STICKER', {
          message: '',
          userName: this.USER_NAME,
          src: e.target.src
        });
        this.isVisibleStickers = false;
      },

      sendImage() {
        fileSelect = this.$refs.fileInput.files;

        if (fileSelect.length > 0) {
          var fileSelect = fileSelect[0];
          var fileReader = new FileReader();

          fileReader.onload = (function(FileLoadEvent) {
            var srcData = FileLoadEvent.target.result;

            socket.emit('SEND_IMAGE', {
              message: this.message,
              userName: this.USER_NAME,
              src: srcData
            });

            this.imagesPreview = undefined;
            this.message = "";
            this.$refs.fileInput.value = null;
          }).bind(this);

          fileReader.readAsDataURL(fileSelect);
        }
      },

      scrollBottom() {
        this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
      },

      getScrollTop() {
        this.isVisibleButtonDown = this.currentScrollTop > this.$refs.messageArea.scrollTop + 200;
      },

      removeMessage(index) {
        this.messages.splice(index, 1);
      },

      showDeleteButton(index) {
        if (this.$refs.remove[index]) this.$refs.remove[index].classList.toggle('room__message-delete_show');
      },

      addImageToPreview(e) {
        this.imagesPreview = URL.createObjectURL(e.target.files[0]);
      },

      removeImageFromPreviews() {
        this.$refs.fileInput.value = null;
        this.imagesPreview = undefined;
      }
    },

    computed: {...mapGetters(['USERS', 'USER_NAME'])},

    watch: {
      isShift() {
        console.log(this.isShift);
      },
      messages() {
        this.$nextTick(() => {
          this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
          this.currentScrollTop = this.$refs.messageArea.scrollTop;
        });
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './Room.scss';
</style>





