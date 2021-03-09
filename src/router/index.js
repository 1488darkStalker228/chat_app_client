import Vue from 'vue';
import VueRouter from 'vue-router';
import VuetifyLayout from "@/components/VuetifyLayout";
import Join from "@/components/Join";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'join',
    component: Join
  },
  {
    path: '/room',
    name: 'room',
    component: VuetifyLayout
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;