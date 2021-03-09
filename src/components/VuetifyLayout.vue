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
  components: {
    Room
  },

  created() {
    //Не позволяем войти не авторизованному пользователю; А также - редиректим при обновлении страницы;
    if(!this.IS_AUTH) this.$router.push({name: 'join'});

    socket.on('JOINED', (data) => {
      this.$store.dispatch({
        type: 'SET_USERS',
        payload: data
      });
    });
    
    socket.on('disconnect', () => {
      console.log();
/*       this.$store.dispatch({
        type: 'SET_USERS',
        payload: data
      }); */
    });

  },

  data: () => ({drawer: null}),

  computed: {
    ...mapGetters(['IS_AUTH','USERS'])
  }
}
</script>

<style scoped>

</style>