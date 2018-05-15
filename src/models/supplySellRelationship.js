import { getRelData } from '../services/supplySell/relationship'

export default {
  namespace: 'relationship',

  state: {
    list: [],
    total: 0,
    loading: false,
    // 下面4个必选
    selectedRowsT: [],
    selectedRowKeysT: [],
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
      // const list = yield select(state => state.relationship.list)
      // const searchParam = yield select(state => state.relationship.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getRelData)
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false,selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
      
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.relationship.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.relationship.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getRelData, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
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
