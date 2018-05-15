import { getSupData } from '../services/supplySell/supplierlist'

export default {
  namespace: 'supplierlist',

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
      const response = yield call(getSupData)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.supplierlist.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.supplierlist.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getSupData, { searchParam, page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
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
