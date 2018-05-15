import { getSplitStrategy } from '../services/order/orderList'

export default {
  namespace: 'splitStrategy',

  state: {
    lists: [],
    data: {},
    splits: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const splits = yield call(getSplitStrategy)
      yield put({
        type: 'changeState',
        payload: { splits: splits.list },
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
    shopName(state, { payload }) {
      return {
        ...state,
        lists: payload,
      }
    },
  },
}
