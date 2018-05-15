import { getOrderDetail, getExpresscorp } from '../services/order/search'
import { getRefundReason } from '../services/aftersale/afterSearch'

export default {
    namespace: 'orderDetail',

    state: {
      list: [],
      loading: false,
      initKey: [],
      giftKey: [],
      expressList: [],
      total: 0,
      page: {},
      payment: [],
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getOrderDetail, payload)
        const payment = yield call(getRefundReason, { dictType: 2 })
        const keys = []
        const gifts = []
        response.list.forEach((ele) => {
          if (ele.isGift === 0) {
            keys.push(ele.skuNo)
          } else {
            gifts.push(ele.skuNo)
          }
        })
        yield put({
          type: 'changeState',
          payload: { payment, ...response, loading: false, initKey: keys, giftKey: gifts },
        })
      },
      *getExpresscorp(_, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getExpresscorp)
        yield put({
          type: 'changeState',
          payload: { expressList: response, loading: false },
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
