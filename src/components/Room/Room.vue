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
    </div>

    <div class="room__scroll-bottom" @click="scrollBottom" :class="{'room__scroll-bottom_show' : isVisible}">
      <ArrowDown/>
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
      @keydown.enter="sendMessage"
      append-outer-icon="mdi-send"
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
  import ArrowDown from '../../assets/ArrowDown.vue';
  import Attach from "@/assets/Attach.vue";
  import Delete from '../../assets/Delete.vue';

  export default {
    name: "Room",

    components: {Attach, ArrowDown, Delete},

    created() {
      socket.on('CHAT_MESSAGE', (data) => this.messages.push(data));
      socket.on('CHAT_IMAGE', (data) => {
        if (data.message === 'sticker1') {
          this.$refs.messageText.replaceWith()
        }

        this.messages.push(data);
      });
    },

    data() {
      return {
        imagesPreview: undefined,
        messages: [],
        message: '',
        isVisible: false,
        currentScrollTop: 0
      }
    },

    methods: {
      removeImageFromPreviews() {
        this.$refs.fileInput.value = null;
        this.imagesPreview = undefined;
      },

      addImageToPreview(e) {
        this.imagesPreview = URL.createObjectURL(e.target.files[0]);
      },

      sendMessage() {
        this.encodeImageFileURL();

        if (!this.imagesPreview && this.message) {
          socket.emit('CHAT_MESSAGE', {message: this.message, userName: this.USER_NAME});
          this.message = '';
        }
      },

      encodeImageFileURL() {
        fileSelect = this.$refs.fileInput.files;

        if (fileSelect.length > 0) {
          var fileSelect = fileSelect[0];
          var fileReader = new FileReader();

          fileReader.onload = (function(FileLoadEvent) {
            var srcData = FileLoadEvent.target.result;

            socket.emit('CHAT_IMAGE', {
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
        if (this.currentScrollTop > this.$refs.messageArea.scrollTop + 200) this.isVisible = true;
        else this.isVisible = false;
      },

      removeMessage(index) {
        this.messages.splice(index, 1);
      },

      showDeleteButton(index) {
        if (this.$refs.remove[index]) this.$refs.remove[index].classList.toggle('room__message-delete_show');
      }
    },

    computed: {...mapGetters(['USERS', 'USER_NAME'])},

    watch: {
      messages() {
        this.$nextTick(() => {
          this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
          this.currentScrollTop = this.$refs.messageArea.scrollTop;
        })
      }
    },

    mounted() {
/*       const test =
       `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 179.019 179.019" style="enable-background:new 0 0 179.019 179.019;" xml:space="preserve">
        <path style="fill:#010002;" d="M138.121,138.357c-13.02,13.008-30.312,20.174-48.714,20.174c-37.955,0-68.84-30.867-68.876-68.81
          l14.046,14.064c0.931,0.925,2.429,0.925,3.359,0c0.919-0.931,0.919-2.434,0-3.359L19.315,81.797L0.698,100.426
          c-0.931,0.925-0.931,2.429,0,3.359c0.459,0.465,1.068,0.692,1.671,0.692c0.615,0,1.223-0.233,1.677-0.692l11.826-11.832
          c1.235,39.531,33.689,71.328,73.512,71.328c19.673,0,38.164-7.661,52.079-21.57c0.925-0.925,0.925-2.429,0-3.353
          C140.562,137.426,139.052,137.426,138.121,138.357z"/>
        <path style="fill:#010002;" d="M178.32,75.234c-0.919-0.925-2.423-0.925-3.353,0L163.152,87.06
          c-1.247-39.531-33.701-71.322-73.518-71.322c-19.685,0-38.17,7.661-52.085,21.57c-0.931,0.925-0.931,2.429,0,3.353
          c0.919,0.931,2.429,0.931,3.353,0c13.014-13.008,30.312-20.174,48.714-20.174c37.949,0,68.84,30.861,68.888,68.81l-14.058-14.064
          c-0.925-0.925-2.429-0.925-3.359,0c-0.919,0.931-0.919,2.434,0,3.359l18.623,18.623l18.617-18.623
          C179.251,77.668,179.251,76.164,178.32,75.234z"/>
      </svg>` */
    }
  }
</script>

<style scoped lang="scss">
  @import './Room.scss';
</style>





