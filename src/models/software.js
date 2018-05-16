import { getSoftwareList } from '../services/base'

export default {
  namespace: 'software',

  state: {
    list: [],
    total: 0,
    page: {},
    selectedRows: [],
    selectedRowKeys: [],
    loading: false,
    searchParam: {},
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.software.searchParam)
      const page = payload && payload.page ? payload.page : Object.assign(yield select(state => state.software.page))
      const {data} = yield call(getSoftwareList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...data, total: data.total, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.software.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.software.searchParam)
      const {data} = yield call(getSoftwareList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...data, total: data.total, loading: false },
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
