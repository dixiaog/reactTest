import { getOrderDetail } from '../services/order/search'

export default {
  namespace: 'orderProductPop',

  state: {
    list: [],
    total: 0,
    loading: false,
    initKey: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    giftKey: [],
    expressList: [],
    current: 1,
    pageSize: 20,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getOrderDetail, payload)
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
        payload: { ...response, loading: false, initKey: keys, giftKey: gifts, total: response.pagination.total },
      })
    },
    *search({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getOrderDetail, payload)
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
        payload: { ...response, loading: false, initKey: keys, giftKey: gifts, total: response.pagination.total },
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
