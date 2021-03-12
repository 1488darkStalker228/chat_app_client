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
          <div class="room__message-text">
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
    </div>

    <div
      class="room__scroll-bottom"
      @click="scrollBottom"
      :class="{'room__scroll-bottom_show' : isVisible}"
    >
     <ArrowDown/>
    </div>

    <div class="room__input-wrapper" style="display: none">
      <input
        @change="addImageToPreview"
        style="display: none"
        id="input"
        type="file"
        ref="fileInput"
      >
      <label for="input">
        <Attach />
      </label>
      <v-text-field style="display: none"
          class="room__message-input"
          v-model="message"
          @click:append-outer="sendMessage"
          @keydown.enter="sendMessage"
          append-icon="'mdi-send'"
          filled
          clear-icon="mdi-close-circle"
          clearable
          hide-details
          label="Message"
          type="text"
      />
    </div>

    <v-textarea
      style="max-height: 100px"
      class="room__textarea"
      append-outer-icon="mdi-send"
      append-icon="mdi-paperclip"
      v-model="message"
      @click:append-outer="sendMessage"
      label="Сообщение"
      hide-details
      rows="2"
      no-resize
    ></v-textarea>
    
    <div class="room__input-wrap" style="display: none">
      <div class="room__images-previews">
        <div
          class="room__images-previews__item"
          v-if="imagesPreview"
        >
          <img :src="imagesPreview" alt=""/>
          <div
            @click="removeImageFromPreviews"
            class="room__images-previews__item__remove-btn"
          >
            &#10006;
          </div>
        </div>
      </div>
    </div>
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
      socket.on('CHAT_IMAGE', (data) => this.messages.push(data));
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
    }
  }
</script>

<style scoped lang="scss">
  @import './Room.scss';
</style>





