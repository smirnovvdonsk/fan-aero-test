import DEFAULTS from '../../../../defaults';

const MODE = {
  namespaced: true,
  state: () => ({ ...DEFAULTS.testing.mode }),
  mutations: {
    setPsi(state, payload) { state.psi = payload; },
    setDiameter(state, payload) { state.diameter = payload; },
    setSpeedMin(state, payload) { state.speedRange.min = payload; },
    setSpeedMax(state, payload) { state.speedRange.max = payload; },
    setMaxPressure(state, payload) { state.maxPressure = payload; },

    setSpeedChange(state, payload) { state.speedChange = payload; },
    setF(state, payload) { state.F = payload; },

    setMaxN(state, payload) { state.maxN = payload; },

    setNEngine(state, payload) { state.NEngine = payload; },
    setNeedNEngine(state, payload) { state.needNEngine = payload; },
    setFnomEngine(state, payload) { state.FnomEngine = payload; },
  },
  actions: {},
  getters: {
    getPsi: ({ psi }) => psi,
    incorrectPsi: ({ psi }) => psi <= 0,

    getDiameter: ({ diameter }) => diameter,
    incorrectDiameter: ({ diameter }) => diameter <= 0,

    getSpeedMin: ({ speedRange }) => speedRange.min,
    getSpeedMax: ({ speedRange }) => speedRange.max,
    incorrectSpeedRange: ({ speedRange }) => (
      speedRange.min <= 0
      || speedRange.max <= 0
      || speedRange.min >= speedRange.max
    ),

    getMaxPressure: ({ maxPressure }) => maxPressure,
    incorrectMaxPressure: ({ maxPressure }) => maxPressure <= 0,

    PVnom: (state, getters, rootState) => rootState.testing.nominals.PVnom,
    PSnom: (state, getters, rootState) => rootState.testing.nominals.PSnom,
    realPressure: ({ speedChange }, {
      PVnom, PSnom, realF, Fnom,
    }) => (
      speedChange
        ? Math.max(PSnom, PVnom) * ((realF / Fnom) ** 2)
        : Math.max(PSnom, PVnom)
    ),

    warningOverPressure: ({ maxPressure }, { realPressure }) => realPressure > maxPressure,

    getSpeedChange: ({ speedChange }) => speedChange,

    Fnom: (state, getters, rootState) => rootState.testing.nominals.Fnom,

    realF: ({ F, speedChange }, { Fnom }) => (speedChange ? F : Fnom),
    incorrectF: ({ F, speedChange }) => speedChange && F <= 0,

    Qnom: (state, getters, rootState) => rootState.testing.nominals.Qnom,

    speedNom: ({ diameter, speedChange }, { realF, Fnom, Qnom }) => (
      (Qnom * (speedChange ? realF : 1) * 1e6 * 4)
      / (Math.PI * (speedChange ? Fnom : 1) * (diameter ** 2) * 3600)
    ),
    speedRealRange: ({ psi }, { speedNom }) => ({
      min: speedNom * (1 - psi / 100),
      max: speedNom * (1 + psi / 100),
    }),

    warningOutsideSpeedRange: ({ speedRange }, { speedRealRange }) => (
      (speedRealRange.min < speedRange.min) || (speedRealRange.max > speedRange.max)
    ),

    Nnom: (state, getters, rootState) => rootState.testing.nominals.Nnom,

    getMaxN: ({ maxN }) => maxN,
    incorrectMaxN: ({ maxN, speedChange }) => speedChange && maxN <= 0,

    getNEngine: ({ NEngine, needNEngine }, { Nnom }) => (needNEngine ? NEngine : Nnom),
    getNeedNEngine: ({ needNEngine }) => needNEngine,
    getFnomEngine: ({ FnomEngine, needNEngine }, { Fnom }) => (needNEngine ? FnomEngine : Fnom),
    incorrectNEngine: ({ NEngine, needNEngine }) => needNEngine && NEngine <= 0,
    incorrectFnomEngine: ({ FnomEngine, needNEngine }) => needNEngine && FnomEngine <= 0,

    engineTorqueNom: (state, { getNEngine, getFnomEngine }) => (
      (60 * getNEngine * 1000) / (2 * Math.PI * getFnomEngine)
    ),
    torque: (state, { realF, realN }) => (
      (60 * realN * 1000) / (2 * Math.PI * realF)
    ),

    realN: (state, { Fnom, Nnom, realF }) => (Nnom * ((realF / Fnom) ** 3)),

    warningOverClocking: (
      { speedChange, needNEngine },
      { realF, getFnomEngine, warningNoNominalPowerAndFreq },
    ) => (
      (speedChange || needNEngine)
      && (!warningNoNominalPowerAndFreq)
      && (realF > getFnomEngine)
    ),

    warningNoNominalPowerAndFreq: ({ speedChange, needNEngine }, { Nnom, Fnom }) => (
      (speedChange || needNEngine) && (Nnom <= 0 || Fnom <= 0)
    ),
    warningPowerOverEngine: ({ speedChange, needNEngine }, { torque, engineTorqueNom }) => (
      (speedChange || needNEngine) && (torque > engineTorqueNom)
    ),

  },
};

export default MODE;
