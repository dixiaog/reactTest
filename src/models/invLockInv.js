import { getLockInventory } from '../services/inventory/lockInv'

export default {
  namespace: 'lockInv',

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
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.lockInv.list)
      // const searchParam = yield select(state => state.lockInv.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getLockInventory)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.lockInv.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.lockInv.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getLockInventory, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, total: response.pagination.total, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
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
