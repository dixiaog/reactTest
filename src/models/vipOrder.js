import { message } from 'antd'
import { getShop } from '../services/order/search'
import { getPickNo } from '../services/order/vipOrder'

export default {
  namespace: 'vipOrder',

  state: {
    loading: false,
    // 下面需要的
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    shopList: [], // 店铺
    list: [],
    shopNo: null,
    checked: null,
    poList: [],
    record: [],
    total: 0,
  },

  effects: {
    *fetchShop(_, { call, put }) {
      const shopList = yield call(getShop, { siteShortName: 'Vip' })
      const index = shopList.findIndex(ele => ele.shopNo === 0)
      shopList.splice(index, 1)
      yield put({
        type: 'changeState',
        payload: { shopList },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.vipOrder.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.vipOrder.searchParam)
      if (!searchParam.poNos.length) {
        message.warning('至少选择一条PO')
      } else {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getPickNo, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, total: response.pagination.total },
        })
      }
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
