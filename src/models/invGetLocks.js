import { getLocks, exportLockInv } from '../services/inventory/lockInv'

export default {
  namespace: 'getLocks',

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
      const response = yield call(getLocks)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.getLocks.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.getLocks.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getLocks, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { searchParam: {}, page: {}, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *export({ payload }, { call }) {
      yield call(exportLockInv, payload)
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
