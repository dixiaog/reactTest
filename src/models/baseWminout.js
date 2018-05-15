import { getWmInOutData, exportSku, getIsLessThanSafeStock } from '../services/division/division'

export default {
  namespace: 'wminout',

  state: {
    list: [],
    loading: false,
    brands: [],
    searchBarProps: {},
    total: 0,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getWmInOutData, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    //  getIsLessThanSafeStock
    *selected(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getIsLessThanSafeStock)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.wminout.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.wminout.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getWmInOutData, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page },
      })
    },
    *export(_, { call, select }) {
      const searchParam = yield select(state => state.division.searchParam)
      yield call(exportSku, { ...searchParam })
    },
  },
  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
