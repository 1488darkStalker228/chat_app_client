<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" app>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Список пользователей
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
<!--      <Join v-if="!IS_AUTH"/>-->
      <Room/>
    </v-main>
  </v-app>
</template>

<script>
// import Join from "@/components/Join";
import Room from "@/components/Room";
import { mapGetters } from 'vuex';

export default {
  components: {
    Room,
    // Join
  },

  created() {

  },

  data: () => ({
    drawer: null,
    userName: '',
    leave: '',
  }),

  computed: {
    ...mapGetters([
      'IS_AUTH',
      'USERS'
    ])
  },

  mounted() {
  }
}
</script>

<style scoped>

</style>