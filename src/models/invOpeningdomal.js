import { list } from '../services/opening/opening'

export default {
  namespace: 'openingdomal',

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
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
      const response = yield call(list)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page: {}, selectedRows: [], },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.openingdomal.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.openingdomal.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(list, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page },
      })
    },
    *export({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.openingdomal.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.openingdomal.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(list, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page },
      })
    },
    *postdelete({ payload }, { call, put }) {
      yield call(list, payload)
      yield put({
        type: 'openingdomal/search',
      })
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
