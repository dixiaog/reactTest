import { getGiftStrategy, exportOrder, getShopName, getChooseData } from '../services/order/giftStrategy'

export default {
  namespace: 'giftStrategy',

  state: {
    list: [],
    total: 0,
    chooseRows: [],
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    lists: [],
    chooseData: null,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.giftStrategy.list)
      // const searchParam = yield select(state => state.giftStrategy.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getGiftStrategy)
        // 
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { selectedRows: [], selectedRowKeys: [], loading: false, searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.giftStrategy.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.giftStrategy.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getGiftStrategy, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, ...searchParam, ...page, total: response.pagination.total },
      })
    },
    *getChooseData({ payload }, { call, put }) {
      const response = yield call(getChooseData, { ...payload })
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
    *exportOrder({ payload }, { call }) {
      yield call(exportOrder, payload)
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
