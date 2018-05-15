import { getFApproveStrategy } from '../services/order/orderList'

export default {
  namespace: 'fApproveStrategy',

  state: {
    lists: [],
    data: {},
    sites: [],
  },

  effects: {
    *getData(_, { call, put }) {
      const data = yield call(getFApproveStrategy)
      yield put({
        type: 'changeState',
        payload: { data: data.list[0] },
      })
    },
    *clean(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { data: {}, sites: [] },
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
