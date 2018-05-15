import { getSku } from '../services/order/orderList'

export default {
  namespace: 'orderList',

  state: {
    list: [],
    total: 0,
    chooseRows: [],
    loading: false,
    searchBarProps: {},
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    loading1: false,
    analyse: [],
    total1: 0,
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call()
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [] },
      })
      yield put({
        type: 'changeState',
        payload: { loading: false },
      })
    },
    *analyses({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading1: true },
      })
      const analyse = yield call(getSku, payload)
      yield put({
        type: 'changeState',
        payload: { analyse, loading1: false },
      })
    },
    *clean(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { analyse: [] },
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
