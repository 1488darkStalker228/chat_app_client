<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app class="nav">
        <v-list-item>
          <v-list-item-content class="pa-5">
            <v-list-item-title class="title">
              Пользователи
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider/>

        <v-list subheader>
          <v-list-item v-for="user of USERS" :key="user.id">
            <v-list-item-content>
              <v-list-item-title>
                {{user.userName}}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-icon>
              <v-icon>
                mdi-account
              </v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app>
        <v-app-bar-nav-icon @click="drawer = !drawer"/>
        <v-toolbar-title>Чат</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <Room/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import Room from "@/components/Room/Room.vue";
  import socket from "@/socket";
  import { mapGetters } from 'vuex';

  export default {
    components: {Room},

    created() {
      const userName = this.generateUserName();
      const userName1 = this.generateUserName();

      this.$store.commit({type: 'SET_USER_NAME', payload: `${userName} ${userName1}`});

      socket.emit('JOINED', `${userName} ${userName1}`);

      socket.on('JOINED', (data) => this.$store.commit({type: 'SET_USERS_TO_STATE', payload: data}));

      socket.on('LEAVE', (data) => this.$store.commit({type: 'SET_USERS_TO_STATE', payload: data}));
    },

    data: () => ({drawer: null}),

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
      }
    },

    computed: {
      ...mapGetters(['USERS'])
    }
  }
</script>

<style>
  html {
    overflow: auto !important;
  }
  * {
    padding: 0;
    margin: 0;
    border: 0;
  }
  ul li {
    list-style: none;
  }
  .nav  {
    background: #f5f5f5 !important;
  }
  img {
    vertical-align: top;
  }
</style>
