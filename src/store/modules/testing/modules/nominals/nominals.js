import DEFAULTS from '../../../../defaults';

const NOMINALS = {
  namespaced: true,
  state: () => ({ ...DEFAULTS.testing.nominals }),
  mutations: {
    setName(state, payload) { state.name = payload; },
    setSerial(state, payload) { state.serial = payload; },
    setPlace(state, payload) { state.place = payload; },

    setQnom(state, payload) { state.Qnom = payload; },
    setQnomPerSecond(state, payload) { state.Qnom = payload * 3600; },
    setPVnom(state, payload) { state.PVnom = payload; },
    setNeedPVnom(state, payload) { state.needPVnom = payload; },
    setPSnom(state, payload) { state.PSnom = payload; },
    setNeedPSnom(state, payload) { state.needPSnom = payload; },

    setDoesCoolOrHeat(state, payload) { state.doesCoolOrHeat = payload; },
    setTnom(state, payload) { state.Tnom = payload; },
    setTnomKelvin(state, payload) { state.Tnom = payload - 273.15; },
    setTout(state, payload) { state.Tout = payload; },
    setToutKelvin(state, payload) { state.Tout = payload - 273.15; },
    setP0nom(state, payload) { state.P0nom = payload; },
    setP0nomMMHg(state, payload) { state.P0nom = (payload / 760) * 101325; },
    setP0nomAtm(state, payload) { state.P0nom = payload * 101325; },

    setNnom(state, payload) { state.Nnom = payload; },
    setNnomWatt(state, payload) { state.Nnom = payload / 1000; },
    setFnom(state, payload) { state.Fnom = payload; },
    setFnomHz(state, payload) { state.Fnom = payload * 60; },

    setSquareOut(state, payload) { state.squareOut = payload; },
    setSizeOutD(state, payload) { state.sizeOutD = payload; },
    setSizeOutB(state, payload) { state.sizeOutB = payload; },
    setSizeOutH(state, payload) { state.sizeOutH = payload; },
  },
  actions: {},
  getters: {
    getName: ({ name }) => name,
    getSerial: ({ serial }) => serial,
    getPlace: ({ place }) => place,

    getQnom: ({ Qnom }) => Qnom,
    getQnomPerSecond: ({ Qnom }) => Qnom / 3600,
    incorrectQnom: ({ Qnom }) => (Qnom <= 0),
    getPVnom: ({ PVnom }) => PVnom,
    incorrectPVnom: ({ PVnom, needPVnom }) => (needPVnom && PVnom <= 0),
    getNeedPVnom: ({ needPVnom }) => needPVnom,
    getPSnom: ({ PSnom }) => PSnom,
    incorrectPSnom: ({ PSnom, needPSnom }) => (needPSnom && PSnom <= 0),
    getNeedPSnom: ({ needPSnom }) => needPSnom,
    warningPressureStaticMoreThanFull(state) {
      return (state.needPVnom && state.needPSnom && state.needPSnom > state.needPVnom);
    },
    warningNoPressuresNeeded: ({ needPVnom, needPSnom }) => (!needPVnom && !needPSnom),
    warningNoStaticForCoolOrHeat: ({ needPSnom, doesCoolOrHeat }) => (doesCoolOrHeat && !needPSnom),

    getDoesCoolOrHeat: ({ doesCoolOrHeat }) => doesCoolOrHeat,
    getTnom: ({ Tnom }) => Tnom,
    getTnomKelvin: ({ Tnom }) => Tnom + 273.15,
    incorrectTnom: ({ Tnom }) => (Tnom <= -273.15),
    getTout: ({ Tout, doesCoolOrHeat, Tnom }) => (doesCoolOrHeat ? Tout : Tnom),
    getToutKelvin: ({ Tout, doesCoolOrHeat, Tnom }) => (doesCoolOrHeat ? Tout : Tnom) + 273.15,
    incorrectTout: ({ Tout, doesCoolOrHeat }) => (doesCoolOrHeat ? (Tout <= -273.15) : false),
    getP0nom: ({ P0nom }) => P0nom,
    getP0nomMMHg: ({ P0nom }) => (P0nom * 760) / 101325,
    getP0nomAtm: ({ P0nom }) => P0nom / 101325,
    incorrectP0nom: ({ P0nom, doesCoolOrHeat }) => (doesCoolOrHeat ? (P0nom <= 0) : false),

    getNnom: ({ Nnom }) => Nnom,
    getNnomWatt: ({ Nnom }) => Nnom * 1000,
    speedChange: (state, getters, rootState) => rootState.testing.mode.speedChange,
    needNEngine: (state, getters, rootState) => rootState.testing.mode.needNEngine,
    incorrectNnom: ({ Nnom }, { speedChange, needNEngine }) => (
      (speedChange || needNEngine) ? (Nnom <= 0) : false
    ),
    getFnom: ({ Fnom }) => Fnom,
    getFnomHz: ({ Fnom }) => Fnom / 60,
    incorrectFnom: ({ Fnom }, { speedChange, needNEngine }) => (
      (speedChange || needNEngine) ? (Fnom <= 0) : false
    ),

    getSquareOut: ({ squareOut }) => squareOut,
    getSizeOutD: ({ sizeOutD }) => sizeOutD,
    getSizeOutB: ({ sizeOutB }) => sizeOutB,
    getSizeOutH: ({ sizeOutH }) => sizeOutH,
    incorrectSizeOut: ({
      squareOut, sizeOutD, sizeOutH, sizeOutB,
    }) => (squareOut ? sizeOutH <= 0 || sizeOutB <= 0 : sizeOutD <= 0),
  },
};

export default NOMINALS;
