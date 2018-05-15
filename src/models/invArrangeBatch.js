import { getarrangePickTaskInfo } from '../services/inventory/pickBatch'

export default {
  namespace: 'arrangeBatch',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
    // 下面4个必选
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
      const response = yield call(getarrangePickTaskInfo, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, searchParam: payload },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.arrangeBatch.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.arrangeBatch.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getarrangePickTaskInfo, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
      })
    },
    *clean(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { searchParam: {},selectedRows: [],selectedRowKeys: [], },
      })
    }
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
