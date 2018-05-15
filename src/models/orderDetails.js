import { getDetails } from '../services/order/vipOutWh'

export default {
    namespace: 'details',

    state: {
      list: [],
      total: 0,
      loading: false,
      page: {},
      searchParam: {},
    },

    effects: {
      *fetch({ payload }, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getDetails, payload)
        if (response !== null) {
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        }
        yield put({
          type: 'changeState',
          payload: { loading: false, searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.details.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.details.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getDetails, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
        })
      },
      *reset(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { 
            list: [],
            total: 0,
            loading: false,
            page: {},
            searchParam: {},
          },
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
