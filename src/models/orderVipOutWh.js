import { getVipOutWh, getShopName, getWarehouse, getExpressCorp } from '../services/order/vipOutWh'
// getChooseData,

export default {
    namespace: 'vipOutWh',

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
      warehouses: [],
      chooseData: null,
      expressCorps: [],
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getVipOutWh)
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
        const statePage = yield select(state => state.vipOutWh.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.vipOutWh.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, { vipInNo: searchParam.vipInNo ? searchParam.vipInNo.trim() : undefined })
        const response = yield call(getVipOutWh, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
        })
      },
      *getChooseData({ payload }, { call, put }) {
        const response = yield call(getVipOutWh, payload)
        yield put({
          type: 'chooseData',
          payload: response.list[0],
        })
      },
      *getExpressCorp(_, { call, put }) {
        const response = yield call(getExpressCorp)
        yield put({
          type: 'expressCorps',
          payload: response,
        })
      },
      *getShopName(_, { call, put }) {
        const response = yield call(getShopName)
        yield put({
          type: 'shopName',
          payload: response,
        })
      },
      *getWarehouse(_, { call, put }) {
        const response = yield call(getWarehouse, {})
        yield put({
          type: 'warehouse',
          payload: response,
        })
      },
      *clear(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { chooseData: null },
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
      warehouse(state, payload) {
        return {
          ...state,
          warehouses: payload.payload,
        }
      },
      expressCorp(state, { payload }) {
        return {
          ...state,
          expressCorps: payload,
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
