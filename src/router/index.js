import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import TypeOfDevice from '../views/TypeOfDevice.vue';

export const stepRoutes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/type-of-device',
    name: 'TypeOfDevice',
    component: TypeOfDevice,
  },
];

const otherRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [stepRoutes, otherRoutes].flat(),
});

export default router;
