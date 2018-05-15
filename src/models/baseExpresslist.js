import { getExpressconfig, delExpressconfigOrPm } from '../services/base/express'
import { getWarehouseEnum } from '../services/base/warehouse'

export default {
  namespace: 'expresslist',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    warehouses: [],
    selectedWhNo: '',
    selectedWhName: '',
  },
  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const warehouses = yield call(getWarehouseEnum)
      let response = {
        list: [],
        total: 0,
      }
      let selectedWhNo = ''
      let selectedWhName = ''
      if (warehouses && warehouses.length) {
        response = yield call(getExpressconfig, { warehouseNo: warehouses[0].warehouseNo, current: 1, pageSize: 20 })
        response.total = response.pagination ? response.pagination.total : 0
        response.list = response.list ? response.list : []
        selectedWhNo = warehouses[0].warehouseNo
        selectedWhName = warehouses[0].warehouseName
        yield put({
          type: 'changeState',
          payload: { ...response, warehouses, loading: false, selectedWhNo, selectedWhName, page: { current: 1, pageSize: 20 } },
        })
      } else {
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false },
        })
      }
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.expresslist.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.expresslist.searchParam)
      let warehouseNo = ''
      let warehouseName = ''
      if (payload) {
        const { selectWh } = payload
        warehouseNo = selectWh ? selectWh.warehouseNo : yield select(state => state.expresslist.warehouseNo)
        warehouseName = selectWh.warehouseName
      } else {
        warehouseNo = yield select(state => state.expresslist.selectedWhNo)
        warehouseName = yield select(state => state.expresslist.selectedWhName)
      }
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getExpressconfig, { warehouseNo, ...searchParam, ...page })
      if (response.list) {
        yield put({
          type: 'changeState',
          payload: {
            ...response,
            total: response.pagination.total,
            loading: false,
            searchParam,
            page,
            selectedWhNo: warehouseNo,
            selectedWhName: warehouseName,
          },
        })
      } else {
        yield put({
          type: 'changeState',
          payload: {
            list: [],
            total: 0,
            loading: false,
            searchParam,
            page,
            selectedWhNo: warehouseNo,
            selectedWhName: warehouseName,
          },
        })
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(delExpressconfigOrPm, payload)
      if (response) {
        yield put({
          type: 'expresslist/search',
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
