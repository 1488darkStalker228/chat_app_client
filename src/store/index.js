import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuth: false,
    users: null,
    userName: null
  },

  actions: {
    IS_AUTH({ commit }, payload) {
      commit('IS_AUTH_COMPLETE', payload.value);
    },

    SET_USERS({ commit }, payload) {
      commit('SET_USER_TO_STATE', payload.payload);
    },

    GET_USER_NAME({ commit }, payload) {
      commit('SET_USER_NAME', payload.payload);
    }
  },

  mutations: {
    IS_AUTH_COMPLETE(state, payload) {
      state.isAuth = payload;
    },

    SET_USER_TO_STATE(state, payload) {
      state.users = payload;
    },

    SET_USER_NAME(state, payload) {
      state.userName = payload;
    }
  },

  getters: {
    IS_AUTH: state => state.isAuth,
    USERS: state => state.users,
    USER_NAME: state => state.userName
  }
});