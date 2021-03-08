<template>
  <div class="join">
    <button @click="onEnter">Войти в чат</button>
  </div>
</template>

<script>
  import socket from "@/socket";

  export default {
    name: "Join",

    methods: {
      generateUserName() {
        let abc = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
        let random = abc[Math.floor(Math.random() * abc.length)];
        let newAbc = "";
        while (newAbc.length < 6) {
          newAbc += random;
          random = abc[Math.floor(Math.random() * abc.length)];
        }
        return newAbc[0].toUpperCase() + newAbc.slice(1);
      },

      onEnter() {
        fetch('http://localhost:3000', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(this.onLogin);
      },

      onLogin() {
        this.$store.dispatch({
          type: 'IS_AUTH',
          payload: true
        });

        socket.emit('JOINED', {
          userName: this.generateUserName()
        });

        this.$router.push({path: '/test'})
      }
    }
  }
</script>

<style scoped>
  .join {
    padding: 8px;
  }
  .join button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 35px;
    background: antiquewhite;
    border-radius: 22px;
    padding: 8px;
  }

</style>