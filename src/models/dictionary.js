import { getDictionary } from '../services/base'

export default {
  namespace: 'dictionary',

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
    // *fetch({ payload }, { call, put, select }) {
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: true },
    //   })
    //   const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.dictionary.searchParam)
    //   const page = payload && payload.page ? payload.page : Object.assign(yield select(state => state.dictionary.page), { current: 1 })
    //   const { data } = yield call(getDictionary, {...searchParam, ...page})
    //   yield put({
    //     type: 'changeState',
    //     payload: { ...data, total: data.total, loading: false },
    //   })
    // },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.dictionary.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.dictionary.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const data = yield call(getDictionary, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...data, loading: false, total: data.total },
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
