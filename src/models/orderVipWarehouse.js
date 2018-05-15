import { getVipWarehouse, getChooseData } from '../services/vip/vipWarehouse'

export default {
    namespace: 'vipWarehouse',

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
      chooseData: null,
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.vipWarehouse.list)
        // const searchParam = yield select(state => state.vipWarehouse.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getVipWarehouse)
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.vipWarehouse.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.vipWarehouse.searchParam)
        Object.assign(searchParam, { warehouseNo: searchParam.warehouseNo ? searchParam.warehouseNo.trim() : undefined,
                                     warehouseName: searchParam.warehouseName ? searchParam.warehouseName.trim() : undefined })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getVipWarehouse, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, total: response.pagination.total, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *getChooseData({ payload }, { call, put }) {
        const response = yield call(getChooseData, payload)
        yield put({
          type: 'chooseData',
          payload: response,
        })
      },
      *clean(_, { put }) {
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
      chooseData(state, { payload }) {
        return {
          ...state,
          chooseData: payload,
        }
      },
    },
}
