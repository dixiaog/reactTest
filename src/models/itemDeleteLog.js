import { getItems } from '../services/api'

export default {
  namespace: 'itemDeleteLog',

  state: {
    list: [],
    loading: false,
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
        payload: { loading: true },
      })
      const response = yield call(getItems)

      yield put({
        type: 'changeState',
        payload: { ...response, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.items.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.items.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getItems, { searchParam, page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page },
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
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
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
