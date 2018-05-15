import { getCreateRestocking } from '../services/inventory/pickBatch'

export default {
  namespace: 'createReplenish',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    searchParam: {
      
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getCreateRestocking, payload)
      const list = []
      Object.keys(response).length && Object.keys(response).forEach((e) => {
        list.push(response[e])
      })
      yield put({
        type: 'changeState',
        payload: { list, loading: false, searchParam: payload, selectedRowKeys: payload.selectedRowKeys },
      })
    },

    *search({ payload }, { call, put, select }) {
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.createReplenish.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getCreateRestocking, { ...searchParam })
      const list = []
      Object.keys(response).length && Object.keys(response).forEach((e) => {
        list.push(response[e])
      })
      yield put({
        type: 'changeState',
        payload: { list, loading: false, searchParam },
      })
    },
    *select({ payload }, { call, put, select }) {
      const searchParam = yield select(state => state.createReplenish.searchParam)
      const { billNoList } = payload
      Object.assign(searchParam, { billNoList })
      yield put({
        type: 'changeState',
        payload: { searchParam },
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
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
