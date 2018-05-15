import moment from 'moment'
import { getShopName } from '../services/item/shopProduct'
import { getRefundOrder } from '../services/aftersale/refundOrder'
import { getRelData } from '../services/supplySell/relationship'

export default {
  namespace: 'refundOrder',

  state: {
    list: [],
    lists: [],
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
    distributor: [],
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.refundOrder.list)
      // const searchParam = yield select(state => state.refundOrder.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getRefundOrder)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], searchParam: {}, selectedRowKeys: [] },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.refundOrder.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.refundOrder.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const start = searchParam.timeStart === undefined || searchParam.timeStart === null ? undefined : moment(searchParam.timeStart).format('YYYY-MM-DD HH:mm:ss')
      const end = searchParam.timeEnd === undefined || searchParam.timeEnd === null ? undefined : moment(searchParam.timeEnd).format('YYYY-MM-DD HH:mm:ss')
      Object.assign(searchParam, { timeStart: start, timeEnd: end })
      const response = yield call(getRefundOrder, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      })
    },
    *getShopName(_, { call, put }) {
      const response = yield call(getShopName)
      yield put({
        type: 'shopName',
        payload: response,
      })
    },
    *getDistributor(_, { call, put }) {
      const customer = []
      const response = yield call(getRelData)
      if (response.list && response.list.length) {
        response.list.forEach((ele) => {
          customer.push({ distributorNo: ele.distributorNo, distributorName: ele.distributorName })
        })
      }
      yield put({
        type: 'distributor',
        payload: customer,
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
    distributor(state, { payload }) {
      return {
        ...state,
        distributor: payload,
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
