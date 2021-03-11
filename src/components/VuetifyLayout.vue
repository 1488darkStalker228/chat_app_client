<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
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
            <v-list-item-title>{{user.userName}}</v-list-item-title>
          </v-list-item-content>
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
</template>

<script>
import Room from "@/components/Room";
import socket from "@/socket";
import { mapGetters } from 'vuex';

export default {
  components: {Room},

  created() {
    const userName = this.generateUserName();

    this.$store.commit({type: 'SET_USER_NAME', payload: userName});

    socket.emit('JOINED', userName);

    socket.on('JOINED', (data) => this.$store.commit({type: 'SET_USERS_TO_STATE', payload: data}));

    socket.on('LEAVE', (data) => this.$store.commit({type: 'SET_USERS_TO_STATE', payload: data}));
  },

  data: () => ({
    drawer: null
  }),

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

<style scoped>

</style>