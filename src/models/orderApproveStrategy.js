import { getApproveStrategy, getChooseData } from '../services/order/approveStrategy'
import { getShopName } from '../services/item/shopProduct'

export default {
  namespace: 'approveStrategy',

  state: {
    list: [],
    lists: [],
    total: 0,
    chooseRows: [],
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    sites: [],
    chooseData: null,
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getApproveStrategy)
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
      })
      yield put({
        type: 'changeState',
        payload: { loading: false },
      })
    },
    // *search({ payload }, { call, put, select }) {
    //   const statePage = yield select(state => state.approveStrategy.page)
    //   const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
    //   const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.approveStrategy.searchParam)
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: true },
    //   })
    //   const response = yield call(getApproveStrategy, { ...searchParam, ...page })
    //   yield put({
    //     type: 'changeState',
    //     payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
    //   })
    // },
    *getChooseData({ payload }, { call, put }) {
      const response = yield call(getChooseData, payload)
      yield put({
        type: 'chooseData',
        payload: response,
      })
    },
    *clear(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { chooseData: null },
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
    chooseData(state, { payload }) {
      return {
        ...state,
        chooseData: payload,
      }
    },
  },
}
