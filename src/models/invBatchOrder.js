import { list } from '../services/base/treasury/treasury'

export default {
  namespace: 'batchOrder',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {
      
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(list, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total },
      })
    },
    // *search({ payload }, { call, put, select }) {
    //   const statePage = yield select(state => state.nobill.page)
    //   const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
    //   const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.nobill.searchParam)
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: true },
    //   })
    //   const response = yield call(list, { ...searchParam, ...page })
    //   yield put({
    //     type: 'changeState',
    //     payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
    //   })
    // },
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
