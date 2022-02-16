import { createStore } from 'vuex';
import { stepRoutes } from '../router/index';

const STEP_PATHS = stepRoutes.map((route) => route.path);

export default createStore({
  state: {
    currentStepIndex: 0,
  },
  mutations: {
    NEXT_STEP(state) { state.currentStepIndex += 1; },
    PREVIOUS_STEP(state) { state.currentStepIndex -= 1; },
  },
  actions: {
  },
  modules: {
  },
  getters: {
    isTheFirstStep() { return (this.state.currentStepIndex === 0); },
    isTheLastStep() { return (this.state.currentStepIndex === (STEP_PATHS.length - 1)); },
  },
});
