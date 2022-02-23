export const CRITERIA_TYPES = {
  SYMMETRIC: '±',
  POSITIVE: '+',
  AT_LEAST: 'не менее',
};

const CRITERIA = {
  namespaced: true,
  state: () => ({
    needQ: true,
    QType: CRITERIA_TYPES.SYMMETRIC,
    QPercent: 15, // %

    needPV: true,
    PVType: CRITERIA_TYPES.SYMMETRIC,
    PVPercent: 15, // %

    needPS: true,
    PSType: CRITERIA_TYPES.SYMMETRIC,
    PSPercent: 15, // %
  }),
  mutations: {
    setNeedQ(state, payload) { state.needQ = payload; },
    setQType(state, payload) {
      if (Object.values(CRITERIA_TYPES).some((type) => type === payload)) state.QType = payload;
    },
    setQPercent(state, payload) { state.QPercent = payload; },

    setNeedPV(state, payload) { state.needPV = payload; },
    setPVType(state, payload) {
      if (Object.values(CRITERIA_TYPES).some((type) => type === payload)) state.PVType = payload;
    },
    setPVPercent(state, payload) { state.PVPercent = payload; },

    setNeedPS(state, payload) { state.needPS = payload; },
    setPSType(state, payload) {
      if (Object.values(CRITERIA_TYPES).some((type) => type === payload)) state.PSType = payload;
    },
    setPSPercent(state, payload) { state.PSPercent = payload; },
  },
  actions: {},
  getters: {
    CRITERIA_TYPES: () => CRITERIA_TYPES,

    getNeedQ: ({ needQ }) => needQ,
    getQType: ({ QType }) => QType,
    getQPercent: ({ QPercent }) => QPercent,
    needQPercent: ({ needQ, QType }) => (
      needQ && (QType === CRITERIA_TYPES.POSITIVE || QType === CRITERIA_TYPES.SYMMETRIC)
    ),
    incorrectQPercent: ({ needQ, QPercent }) => (needQ && QPercent <= 0),

    getNeedPV: ({ needPV }) => needPV,
    getPVType: ({ PVType }) => PVType,
    getPVPercent: ({ PVPercent }) => PVPercent,
    needPVPercent: ({ needPV, PVType }) => (
      needPV && (PVType === CRITERIA_TYPES.POSITIVE || PVType === CRITERIA_TYPES.SYMMETRIC)
    ),
    incorrectPVPercent: ({ needPV, PVPercent }) => (needPV && PVPercent <= 0),

    getNeedPS: ({ needPS }) => needPS,
    getPSType: ({ PSType }) => PSType,
    getPSPercent: ({ PSPercent }) => PSPercent,
    needPSPercent: ({ needPS, PSType }) => (
      needPS && (PSType === CRITERIA_TYPES.POSITIVE || PSType === CRITERIA_TYPES.SYMMETRIC)
    ),
    incorrectPSPercent: ({ needPS, PSPercent }) => (needPS && PSPercent <= 0),
  },
};

export default CRITERIA;
