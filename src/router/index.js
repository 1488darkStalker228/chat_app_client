import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from "@/components/Test";
import Join from "@/components/Join";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Join
  },
  {
    path: '/test',
    component: Test
  }
];

const router = new VueRouter({
  mode: 'history',
  routes
});

export default router;