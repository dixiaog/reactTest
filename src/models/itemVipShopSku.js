import { getVipShopSku, getShopName } from '../services/item/vipShopSku'

export default {
    namespace: 'vipShopSku',

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
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getVipShopSku)
        if (response !== null) {
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.vipShopSku.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.vipShopSku.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, {
          skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined,
        })
        const response = yield call(getVipShopSku, { ...searchParam, ...page })
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
