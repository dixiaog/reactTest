import { getSite } from '../services/api'
import { getData } from '../services/order/orderList'
import { getShopName } from '../services/item/shopProduct'

export default {
  namespace: 'specialStrategy',

  state: {
    lists: [],
    data: {},
    sites: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const sites = yield call(getSite)
      yield put({
        type: 'changeState',
        payload: { sites },
      })
    },
    *getData(_, { call, put }) {
      const data = yield call(getData)
      yield put({
        type: 'changeState',
        payload: { data },
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { data: {}, sites: [] },
      })
    },
    *getShopName(_, { call, put }) {
      const response = yield call(getShopName)
      yield put({
        type: 'shopName',
        payload: response,
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
