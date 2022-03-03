const POINT = { // Один (из трёх) режим измерения (одно положение заслонки)
  namespaced: true,
  state: () => ({
    deltaPsiForLargeDuct: Array(8).fill(0),
    deltaPdiForLargeDuct: Array(8).fill(0),
    deltaPsiForSmallDuct: Array(4).fill(0),
    deltaPdiForSmallDuct: Array(4).fill(0),
  }),
  mutations: {
    setDeltaPsiForLargeDuct(state, payload) {
      Object.assign(state.deltaPsiForLargeDuct, payload);
      state.deltaPsiForLargeDuct.length = 8;
    },
    setDeltaPdiForLargeDuct(state, payload) {
      Object.assign(state.deltaPdiForLargeDuct, payload);
      state.deltaPdiForLargeDuct.length = 8;
    },
    setDeltaPsiForSmallDuct(state, payload) {
      Object.assign(state.deltaPsiForSmallDuct, payload);
      state.deltaPsiForSmallDuct.length = 4;
    },
    setDeltaPdiForSmallDuct(state, payload) {
      Object.assign(state.deltaPdiForSmallDuct, payload);
      state.deltaPdiForSmallDuct.length = 4;
    },
  },
  actions: {
    setDeltaPsi({ commit, getters }, payload) {
      if (getters.largeDuct) {
        commit('setDeltaPsiForLargeDuct', payload);
      } else {
        commit('setDeltaPsiForSmallDuct', payload);
      }
    },
    setDeltaPdi({ commit, getters }, payload) {
      if (getters.largeDuct) {
        commit('setDeltaPdiForLargeDuct', payload);
      } else {
        commit('setDeltaPdiForSmallDuct', payload);
      }
    },
  },
  getters: {
    largeDuct: (state, getters, rootState, rootGetters) => (
      // Используется большой воздуховод D > 300мм
      rootGetters['testing/mode/largeDuct']
    ),
    getDeltaPsi: ({ deltaPsiForLargeDuct, deltaPsiForSmallDuct }, { largeDuct }) => (
      largeDuct ? deltaPsiForLargeDuct : deltaPsiForSmallDuct
    ),
    incorrectDeltaPsiItems: (state, { getDeltaPsi }) => (
      [...getDeltaPsi].map((item) => (item === undefined || item <= 0))
    ),
    incorrectDeltaPsi: (state, { getDeltaPsi, largeDuct, incorrectDeltaPsiItems }) => (
      [...incorrectDeltaPsiItems].some((item) => (item))
      || getDeltaPsi.length !== (largeDuct ? 8 : 4)
    ),
    getDeltaPdi: ({ deltaPdiForLargeDuct, deltaPdiForSmallDuct }, { largeDuct }) => (
      largeDuct ? deltaPdiForLargeDuct : deltaPdiForSmallDuct
    ),
    incorrectDeltaPdiItems: (state, { getDeltaPdi }) => (
      [...getDeltaPdi].map((item) => (item === undefined || item <= 0))
    ),
    incorrectDeltaPdi: (state, { getDeltaPdi, largeDuct, incorrectDeltaPdiItems }) => (
      [...incorrectDeltaPdiItems].some((item) => (item))
      || getDeltaPdi.length !== (largeDuct ? 8 : 4)
    ),
    // Результаты
    barometerPascal: (state, getters, rootState, rootGetters) => (
      // p'0
      rootGetters['testing/getBarometerPascal']
    ),
    thermometerKelvin: (state, getters, rootState, rootGetters) => (
      // t'A
      rootGetters['testing/getThermometerKelvin']
    ),
    Ps(state, { getDeltaPsi }) {
      const n = getDeltaPsi.length;
      const sum = getDeltaPsi.reduce((acc, num) => acc + Math.abs(num), 0);
      return sum / n;
    },
    Pd(state, { getDeltaPdi }) {
      const n = getDeltaPdi.length;
      const sum = getDeltaPdi.reduce((acc, num) => acc + (Math.abs(num) ** 0.5), 0);
      return (sum / n) ** 2;
    },
    Pt1: (state, { Ps, Pd }) => Pd - Math.abs(Ps),
    R: (state, getters, rootState, rootGetters) => rootGetters.R,
    density: (state, { // ρ_m , кг/м3
      barometerPascal, Ps, R, thermometerKelvin,
    }) => (barometerPascal - Ps) / (R * thermometerKelvin),
    Vm: (state, { density, Pd }) => ((2 / density) * Pd) ** 0.5, // м/с
    diameter: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/mode/getDiameter']
    ),
    Fcoeff: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/Fcoeff']
    ),
    Q: (state, { diameter, Fcoeff, Vm }) => (
      (Math.PI / 4) * (diameter ** 2 / 1e6) * Fcoeff * Vm * 3600
    ),
    psiNom: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/mode/getPsi']
    ),
    Qnom: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getQnom']
    ),
    psi: (state, { Q, Qnom }) => (Math.abs(Q - Qnom) / Qnom) * 100,
    meetsPsi: (state, { psi, psiNom }) => psi < psiNom,

    square: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/square']
    ),
    Vout: (state, { square, Q, Fcoeff }) => Q / Fcoeff / square / 3600,
    PdOut: (state, { density, Vout }) => density * (Vout ** 2 / 2),
    PtOut: (state, { PdOut }) => PdOut,
    PvAcute: (state, { PtOut, Pt1 }) => PtOut - Pt1,
    needPSnom: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getNeedPSnom']
    ),
    P0nom: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getP0nom']
    ),
    PSnom: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getPSnom']
    ),
    ToutKelvin: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getToutKelvin']
    ),
    TnomKelvin: (state, getters, rootState, rootGetters) => (
      rootGetters['testing/nominals/getTnomKelvin']
    ),
    densityOut: (state, {
      P0nom, PSnom, Ps, needPSnom, R, ToutKelvin, Fcoeff,
    }) => (
      needPSnom
        ? (P0nom + Math.abs(PSnom)) / (R * ToutKelvin)
        : (P0nom + Math.abs(Ps / (Fcoeff ** 2))) / (R * ToutKelvin)
    ),
    Pv: (state, {
      PvAcute, densityOut, density, Fcoeff,
    }) => (
      PvAcute * (densityOut / density) * Fcoeff ** 2
    ),
    Pdv: (state, {
      PdOut, densityOut, density, Fcoeff,
    }) => (
      PdOut * (densityOut / density) * Fcoeff ** 2
    ),
    Psv: (state, { Pv, Pdv }) => Pv - Pdv,
  },
  modules: {},
};

export default POINT;
