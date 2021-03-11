<template>
  <div class="room pa-3">
    <div class="room__messages pa-7 scroll-style" ref="messageArea" @scroll="test">
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

<!--    <div-->
<!--      class="room__scroll-bottom"-->
<!--      @click="scrollBottom"-->
<!--    >-->
<!--      <ArrowDown/>-->
<!--    </div>-->

    <div class="room__input-wrapper">
      <input @change="addImageToPreview" style="display: none" id="input" type="file" ref="fileInput">
      <label for="input">
        <Attach />
      </label>
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

    <div class="room__input-wrap">
      <div class="room__images-previews">
        <div class="room__images-previews__item" v-if="imagesPreview">
          <img :src="imagesPreview" alt=""/>
          <div @click="removeImageFromPreviews" class="room__images-previews__item__remove-btn">
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
  // import ArrowDown from '../../assets/ArrowDown.vue';
  import Attach from "@/assets/Attach.vue";

  export default {
    name: "Room",

    components: {Attach},

    created() {
      socket.on('CHAT_MESSAGE', (data) => this.messages.push(data));
      socket.on('CHAT_IMAGE', (data) => this.messages.push(data));
    },

    data() {
      return {
        imagesPreview: undefined,
        messages: [],
        message: ''
      }
    },

    methods: {
      removeImageFromPreviews() {
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

      test() {
        // console.log(this.$refs.messageArea.scrollTop, 'scrollTop');
        console.log(this.$refs.messageArea.scrollHeight, 'scrollHeight');
      }
    },

    computed: {...mapGetters(['USERS', 'USER_NAME'])},

    watch: {
      messages() {
        // console.log(this.$refs.messageArea.scrollTop, 'scrollTop');
        // console.log(this.$refs.messageArea.scrollHeight, 'scrollHeight');
        // console.log(this.$refs.messageArea.scrollHeight - this.$refs.messageArea.scrollTop);
        // console.log(this.$refs.messageArea.scrollTop)
        // console.log(this.$refs.messageArea.scrollHeight)
        // this.$nextTick(() => {
        //   console.log(this.$refs.messageArea.scrollHeight)
        //   this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
        // });
        setTimeout(() => {
          this.$refs.messageArea.scrollTop = this.$refs.messageArea.scrollHeight;
        }, 0)


        // console.log(this.$refs.messageArea.scrollTop, 'scrollTop after');
        // console.log(this.$refs.messageArea.scrollHeight, 'scrollHeight after');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import './Room.scss';
</style>





