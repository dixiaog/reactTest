import { editLockInventoryShow } from '../services/inventory/lockInv'

export default {
  namespace: 'editLocks',

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
      const response = yield call(editLockInventoryShow, {})
      yield put({
        type: 'changeState',
        payload: { list: response, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.editLocks.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.editLocks.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(editLockInventoryShow, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { searchParam: {}, page: {}, selectedRows: [], selectedRowKeys: [] },
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
