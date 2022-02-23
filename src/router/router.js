import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/Home.vue';
import NominalBlowing from '../views/NominalBlowing.vue';
import NominalAir from '../views/NominalAir.vue';
import NominalDrive from '../views/NominalDrive.vue';
import NominalOutletSize from '../views/NominalOutletSize.vue';
import NominalMisc from '../views/NominalMisc.vue';
import ModeConstants from '../views/ModeConstants.vue';
import SelectMode from '../views/SelectMode.vue';

export const stepRoutes = [
  {
    path: '/',
    name: 'Введение',
    component: Home,
  },
  {
    path: '/nominal-misc',
    name: 'Номинал изделия. Сведения об экземпляре',
    component: NominalMisc,
  },
  {
    path: '/nominal-air',
    name: 'Номинал изделия. Перемещаемый воздух',
    component: NominalAir,
  },
  {
    path: '/nominal-blowing',
    name: 'Номинал изделия. Воздушный поток',
    component: NominalBlowing,
  },
  {
    path: '/nominal-outlet-size',
    name: 'Номинал изделия. Выходной патрубок',
    component: NominalOutletSize,
  },
  {
    path: '/nominal-drive',
    name: 'Номинал изделия. Привод рабочего колеса',
    component: NominalDrive,
  },
  {
    path: '/mode-constants',
    name: 'Общие параметры испытания',
    component: ModeConstants,
  },
  {
    path: '/select-mode',
    name: 'Подбор параметров испытаний',
    component: SelectMode,
  },
];

const otherRoutes = [];

const router = createRouter({
  history: createWebHashHistory(),
  routes: [stepRoutes, otherRoutes].flat(),
});

export default router;
