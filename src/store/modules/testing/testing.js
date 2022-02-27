import nominals from './modules/nominals/nominals';
import criteria from './modules/criteria/criteria';
import mode from './modules/mode/mode';
import point from './modules/point/point';

const TESTING = {
  namespaced: true,
  state: () => ({
    barometer: 0, // мм.рт.ст. p'б - Показания барометра
    thermometer: -273.15, // °C. tA - Показания термометра
  }),
  mutations: {
    setBarometer(state, payload) { state.barometer = payload; },
    setBarometerPascal(state, payload) { state.barometer = (payload * 760) / 101325; },
    setThermometer(state, payload) { state.thermometer = payload; },
    setThermometerKelvin(state, payload) { state.thermometer = payload - 273.15; },
  },
  actions: {
    setDeltaP({ dispatch }, payload) {
      dispatch('point1/setDeltaPsi', payload.point1.deltaPsiArray);
      dispatch('point1/setDeltaPdi', payload.point1.deltaPdiArray);
      dispatch('point2/setDeltaPsi', payload.point2.deltaPsiArray);
      dispatch('point2/setDeltaPdi', payload.point2.deltaPdiArray);
      dispatch('point3/setDeltaPsi', payload.point3.deltaPsiArray);
      dispatch('point3/setDeltaPdi', payload.point3.deltaPdiArray);
    },
  },
  getters: {
    getSpeedChange: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/mode/getSpeedChange']
    ),
    getNeedNEngine: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/mode/getNeedNEngine']
    ),
    realF: (state, getters, rootState, rootGetters) => ( // f исп
      rootGetters['testing/mode/realF']
    ),
    Fnom: (state, getters, rootState, rootGetters) => ( // f ном
      rootGetters['testing/nominals/getFnom']
    ),
    Fcoeff: (state, {
      getSpeedChange, getNeedNEngine, realF, Fnom,
    }) => (
      // Отношение частот: испытательная к номинальной
      (getSpeedChange || getNeedNEngine) ? (Fnom / realF) : 1
    ),

    getBarometer: ({ barometer }) => barometer,
    getBarometerPascal: ({ barometer }) => 101325 * (barometer / 760), // p'0
    incorrectBarometer: ({ barometer }) => barometer <= 0,
    getThermometer: ({ thermometer }) => thermometer,
    getThermometerKelvin: ({ thermometer }) => thermometer + 273.15, // t'A
    incorrectThermometer: ({ thermometer }) => thermometer <= -273.15,

    ToutKelvin: (state, getters, rootState, rootGetters) => ( // t'вых
      rootGetters.testing.nominals.getToutKelvin
    ),

    getDeltaP: (state, getters) => (
      {
        point1: {
          deltaPsiArray: getters['point1/getDeltaPsi'],
          incorrectdeltaPsi: getters['point1/incorrectDeltaPsi'],
          incorrectdeltaPsiItems: getters['point1/incorrectDeltaPsiItems'],

          deltaPdiArray: getters['point1/getDeltaPdi'],
          incorrectdeltaPdi: getters['point1/incorrectDeltaPdi'],
          incorrectdeltaPdiItems: getters['point1/incorrectDeltaPdiItems'],
        },
        point2: {
          deltaPsiArray: getters['point2/getDeltaPsi'],
          incorrectdeltaPsi: getters['point2/incorrectDeltaPsi'],
          incorrectdeltaPsiItems: getters['point2/incorrectDeltaPsiItems'],

          deltaPdiArray: getters['point2/getDeltaPdi'],
          incorrectdeltaPdi: getters['point2/incorrectDeltaPdi'],
          incorrectdeltaPdiItems: getters['point2/incorrectDeltaPdiItems'],
        },
        point3: {
          deltaPsiArray: getters['point3/getDeltaPsi'],
          incorrectdeltaPsi: getters['point3/incorrectDeltaPsi'],
          incorrectdeltaPsiItems: getters['point3/incorrectDeltaPsiItems'],

          deltaPdiArray: getters['point3/getDeltaPdi'],
          incorrectdeltaPdi: getters['point3/incorrectDeltaPdi'],
          incorrectdeltaPdiItems: getters['point3/incorrectDeltaPdiItems'],
        },
      }
    ),
    incorrectDeltaP: (state, getters) => (
      getters['point1/incorrectDeltaPsi']
      || getters['point1/incorrectDeltaPdi']
      || getters['point2/incorrectDeltaPsi']
      || getters['point2/incorrectDeltaPdi']
      || getters['point3/incorrectDeltaPsi']
      || getters['point3/incorrectDeltaPdi']
    ),
    PsArray: (state, getters) => [
      getters['point1/Ps'],
      getters['point2/Ps'],
      getters['point3/Ps'],
    ],
    PdArray: (state, getters) => [
      getters['point1/Pd'],
      getters['point2/Pd'],
      getters['point3/Pd'],
    ],
    Pt1Array: (state, getters) => [
      getters['point1/Pt1'],
      getters['point2/Pt1'],
      getters['point3/Pt1'],
    ],
    densityArray: (state, getters) => [
      getters['point1/density'],
      getters['point2/density'],
      getters['point3/density'],
    ],
    VmArray: (state, getters) => [
      getters['point1/Vm'],
      getters['point2/Vm'],
      getters['point3/Vm'],
    ],
    QArray: (state, getters) => [
      getters['point1/Q'],
      getters['point2/Q'],
      getters['point3/Q'],
    ],
  },
  modules: {
    nominals,
    criteria,
    mode,
    point1: point,
    point2: point,
    point3: point,
  },
};

export default TESTING;
