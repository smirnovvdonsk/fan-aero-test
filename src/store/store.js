import { createStore } from 'vuex';
import { stepRoutes } from '../router/router';
import TESTING from './modules/testing/testing';
import DEFAULTS from './defaults';

const STEP_PATHS = stepRoutes.map((route) => route.path);
const STEP_NAMES = stepRoutes.map((route) => route.name);

export default createStore({
  state: {
    currentStepIndex: DEFAULTS.currentStepIndex,
  },
  modules: {
    testing: TESTING,
  },
  mutations: {
    NEXT_STEP(state) { state.currentStepIndex += 1; },
    PREVIOUS_STEP(state) { state.currentStepIndex -= 1; },
    LOAD(state, payload) {
      Object.keys(state).forEach((key) => {
        if (typeof state[key] === 'object') {
          Object.assign(state[key], payload[key]);
        } else {
          state[key] = payload[key];
        }
      });
    },
  },
  actions: {
    setNextStep({ commit, getters }) { if (!getters.isTheLastStep) commit('NEXT_STEP'); },
    setPreviousStep({ commit, getters }) { if (!getters.isTheFirstStep) commit('PREVIOUS_STEP'); },
  },
  getters: {
    isTheFirstStep: (state) => (state.currentStepIndex <= 0),
    isTheLastStep: (state) => (state.currentStepIndex >= (STEP_PATHS.length - 1)),
    currentStepPath: (state) => STEP_PATHS[state.currentStepIndex],
    currentStepName: (state) => STEP_NAMES[state.currentStepIndex],
  },
});
