import { getPurData } from '../services/inventory/manager'

export default {
  namespace: 'good',

  state: {
    list: [],
    total: 0,
    loading: false,
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getPurData)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.manager.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.manager.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getPurData, { searchParam, page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page },
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
