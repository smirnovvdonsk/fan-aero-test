const MODE = {
  namespaced: true,
  state: () => ({
    psi: 20, // %. Расхождение графика по расходу (ширина характеристики максимальная)
    speedRange: { // м/с. Диапазон скоростей измерения
      min: 5,
      max: 25,
    },
    diameter: 0, // мм. Диаметр воздуховода
    maxPressure: 3000, // Па

    speedChange: false, // Будем ли мы замедлять/ускорять колесо при испытаниях
    F: 0, // об/мин. Испытательная частота оборотов

    maxN: 110, // кВт. Максимальная мощность на объекте

    needNEngine: false, // Будем ли мы использовать нештатный двигатель
    NEngine: 0, // кВт. Мощность испытательного двигателя
    FnomEngine: 0, // об/мин. Номинальная частота испытательного двигателя
  }),
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
    largeDuct: (state, { getDiameter }) => getDiameter > 300,

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
    warningPowerOverNetwork: ({ speedChange, needNEngine }, { realN, getMaxN }) => (
      (speedChange || needNEngine) && (realN > getMaxN)
    ),

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

    R: (state, getters, rootState, { R }) => R,
    wantedStaticPressure: ({ diameter }, {
      Qnom, R, realF, Fnom, getSpeedChange,
    }) => {
      const Q = Qnom * (getSpeedChange ? (realF / Fnom) : 1);
      const numerator = (4 * 1e6 * Q) ** 2 * 101325;
      const denominator = (3600 * Math.PI * diameter ** 2) ** 2 * 2 * R * 293.15;
      return numerator / denominator;
    },
    wantedStaticPressures({ psi }, { wantedStaticPressure }) { // [[0, 0], [0, 0], [0, 0]]
      const min = wantedStaticPressure * (1 - psi / 100) ** 2;
      const mid = wantedStaticPressure;
      const max = wantedStaticPressure * (1 + psi / 100) ** 2;
      const range = max - min;
      return [[min, min + range / 3], [mid - range / 6, mid + range / 6], [max - range / 3, max]];
    },
    wantedSpeeds(state, { speedRealRange }) {
      const { min, max } = speedRealRange;
      const mid = (max - min) / 2;
      const range = max - min;
      return [[min, min + range / 3], [mid - range / 6, mid + range / 6], [max - range / 3, max]];
    },
  },
};

export default MODE;
