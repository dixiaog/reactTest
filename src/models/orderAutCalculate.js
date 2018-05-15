import { getAutCalculate } from '../services/order/search'

export default {
    namespace: 'autCalculate',

    state: {
      list: [],
      total: 0,
      loading: false,
      // 下面需要的
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
        const response = yield call(getAutCalculate)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.autCalculate.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.autCalculate.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getAutCalculate, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page },
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
