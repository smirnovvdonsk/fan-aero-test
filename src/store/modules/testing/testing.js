import nominals from './modules/nominals/nominals';
import criteria from './modules/criteria/criteria';
import mode from './modules/mode/mode';

const TESTING = {
  namespaced: true,
  state: () => ({}),
  mutations: {},
  actions: {},
  getters: {},
  modules: {
    nominals,
    criteria,
    mode,
  },
};

export default TESTING;
