import { getPowerList, getChoosePower } from '../services/system'

export default {
  namespace: 'power',

  state: {
    list: [],
    total: 0,
    page: {},
    selectedRows: [],
    selectedRowKeys: [],
    loading: false,
    searchParam: {},
    chooseData: null,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.power.searchParam)
      const page = payload && payload.page ? payload.page : Object.assign(yield select(state => state.power.page))
      const response = yield call(getPowerList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, total: response.total, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.power.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.power.searchParam)
      const response = yield call(getPowerList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, total: response.total, loading: false },
      })
    },
    *getChooseData({ payload }, { call, put, select }) {
      const response = yield call(getChoosePower, payload)
      yield put({
        type: 'changeState',
        payload: { chooseData: response },
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { chooseData: null },
      })
    },
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
