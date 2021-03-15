<template>
  <div class="room pa-3">

    <div class="room__subheader">
      <h1 v-if="!isVisibleButtonDown && !isVisibleDeletePanel">Сообщения</h1>
      <div class="room__delete-panel" :class="{'room__delete-panel_show' : isVisibleDeletePanel}">
        <v-btn @click="removeMessage" color="primary" elevation="3" raised style="margin-right: 16px">
          Удалить
        </v-btn>
        <v-btn @click="clearIndexState" color="primary" elevation="3" raised>
          Отменить
        </v-btn>
      </div>

      <div class="room__scroll-bottom" @click="scrollBottom" :class="{'room__scroll-bottom_show' : isVisibleButtonDown}">
        <v-btn color="primary" elevation="3" raised>
          Вниз
        </v-btn>
      </div>
    </div>

    <div class="room__messages scroll-style pa-7" ref="messageArea" @scroll="getScrollTop">
      <ul class="room__list">
        <li class="room__item" v-for="(message, index) of messages" :key="index" @click="toggleToDelete(index)" ref="listItem">
          <div class="room__message-wrapper" :class="message.userName === USER_NAME ? 'from-me' : 'from-them'">
            <div class="room__message-text" ref="messageText">
              {{message.userName}}: {{message.message}}
            </div>
            <img class="room__img" alt="" :src="message.src" v-if="message.src"/>
          </div>
        </li>
      </ul>

      <div class="room__images-previews">
        <div class="room__images-previews__item" v-if="imagesPreview">
          <img :src="imagesPreview" alt=""/>
          <div class="room__images-previews__item__remove-btn" @click="removeImageFromPreviews">&#10006;</div>
        </div>
      </div>

      <div class="room__sticker-wrapper" v-show="isVisibleStickers">
        <img v-for="(sticker, index) of stickers" @click="sendSticker" :key="index" :src="require('../../assets/stickers/' + sticker)" alt="">
      </div>
    </div>

    <div class="room__input-wrapper">
      <input @change="addImageToPreview" style="display: none" id="input" type="file" ref="fileInput">
      <label for="input">
        <Attach/>
      </label>
    </div>

    <v-textarea
      class="room__textarea"
      v-model="message"
      @click:append-outer="sendMessage"
      @click:prepend-inner="isVisibleStickers = !isVisibleStickers"
      @keydown.enter.prevent="sendMessage"
      append-outer-icon="mdi-send"
      prepend-inner-icon="mdi-sticker-plus"
      label="Сообщение"
      hide-details
      rows="3"
      no-resize
    />
    <!-- @keydown="sendMessage"
    @keyup="sendMessage" -->
  </div>
</template>

<script>
  import socket from "@/socket";
  import { mapGetters } from 'vuex';
  import Attach from "@/assets/Attach.vue";

  export default {
    name: "Room",

    components: {Attach},

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
        isVisibleDeletePanel: false,
        currentScrollTop: 0,
        stickers: [
          '12669-150x150.png',
          '12670-150x150.png',
          '12671-150x150.png',
          '12673-150x150.png',
          '12674-150x150.png'
        ],
        indexes: []
      }
    },

    methods: {
      sendMessage() {
        /* 
        if (e.key === 'Shift') {
          this.isShift = e.type !== 'keyup';
          return;
        }
        if (e.type === 'keydown' && e.key === 'Enter' && this.isShift) {
          return;
        }
        if (e.type === 'keydown' && e.key === 'Enter' && !this.isShift) {
          e.preventDefault();
          this.sendImage();
          if (!this.imagesPreview && this.message.trim()) {
            socket.emit('SEND_MESSAGE', {
              message: this.message,
              userName: this.USER_NAME
            });
            this.message = '';
          }
        }
        */
        this.sendImage();
        if (!this.imagesPreview && this.message) {
          socket.emit('SEND_MESSAGE', {
            message: this.message,
            userName: this.USER_NAME
          });
          this.message = '';
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

      hideStickers(e) {
        if(!e.target.closest('room__sticker-wrapper')) {
          this.isVisibleStickers = false;
        }
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

      removeMessage() {
        const sort = this.indexes.sort((a, b) => a - b);

        while(sort.length) {
          this.messages.splice(sort.pop(), 1);
        }
        this.clearIndexState();
      },

      toggleToDelete(index) {
        this.isVisibleDeletePanel = true;

        const findIndex = this.indexes.find(item => item === index);
        if (findIndex !== undefined) {
          this.indexes = this.indexes.filter(item => item !== findIndex);
          this.indexes.length === 0 ? this.isVisibleDeletePanel = false: '';
        } 
        else this.indexes.push(index);
  
        this.$refs.listItem[index].classList.toggle('room__item_active');
      },

      clearIndexState() {
        this.isVisibleDeletePanel = false;
        this.$refs.listItem.forEach(item => item.classList.remove('room__item_active'));
        this.indexes = [];
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
/*       isShift() {
        console.log(this.isShift);
      }, */
      messages() {
        this.$nextTick(() => {
          this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
          this.currentScrollTop = this.$refs.messageArea.scrollTop;
        });
      }
    },

    mounted() {
      window.addEventListener('click', this.hideStickers);
    },

    beforeDestroy() {
      window.removeEventListener('click', this.hideStickers);
    }
  }
</script>

<style scoped lang="scss">
  @import './Room.scss';
</style>





