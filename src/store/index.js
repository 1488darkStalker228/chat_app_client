import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: null,
    userName: null
  },

  mutations: {
    SET_USERS_TO_STATE(state, payload) {
      state.users = payload.payload;
    },

    SET_USER_NAME(state, payload) {
      state.userName = payload.payload;
    }
  },

  getters: {
    USERS: state => state.users,
    USER_NAME: state => state.userName
  }
});