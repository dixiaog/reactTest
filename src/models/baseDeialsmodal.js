import { selectById } from '../services/opening/opening'

export default {
  namespace: 'deialsmodal',

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
    billNo: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
          billNo: payload.billNo,
        },
      })
      const response = yield call(selectById, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.deialsmodal.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.deialsmodal.searchParam)
      searchParam.billNo = yield select(state => state.deialsmodal.billNo)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectById, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page },
      })
    },
    *postdelete({ payload }, { call, put }) {
      yield call(selectById, payload)
      yield put({
        type: 'deialsmodal/search',
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
