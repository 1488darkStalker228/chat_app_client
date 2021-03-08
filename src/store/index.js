import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false,
    users: [],
    messages: []
  },

  actions: {
    IS_AUTH({ commit }, payload) {
      commit('IS_AUTH_COMPLETE', payload.payload);
    },

    SET_USERS({ commit }, payload) {
      commit('SET_USER_TO_STATE', payload.payload);
    }
  },

  mutations: {
    IS_AUTH_COMPLETE(state, payload) {
      state.isAuth = payload;
    },

    SET_USER_TO_STATE(state, payload) {
      payload.forEach(item => state.users.push(item));
    }
  },

  getters: {
    IS_AUTH: state => state.isAuth,
    USERS: state => state.users
  }
});