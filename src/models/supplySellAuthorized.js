import { getAuthorizedData, getDistributorList } from '../services/supplySell/authorized'

export default {
  namespace: 'authorized',

  state: {
    list: [],
    total: 0,
    loading: false,
    distributorList: [],
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
      // const list = yield select(state => state.authorized.list)
      // const searchParam = yield select(state => state.authorized.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getAuthorizedData)
        const distributorList = yield call(getDistributorList)
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, distributorList },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.authorized.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.authorized.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getAuthorizedData, { ...searchParam, ...page })
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
