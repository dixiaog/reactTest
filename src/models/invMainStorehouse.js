import moment from 'moment'
import { getWmInOut, exportDetail, getWarehouseWmInOutData } from '../services/inventory/itemInv'
import { getWarehouse } from '../services/division/division'

export default {
    namespace: 'mainStorehouse',

    state: {
      list: [],
      total: 0,
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      warehouses: [],
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getWmInOut, payload)
        // console.log(payload, response)
        yield put({
          type: 'changeState',
          // payload: response,
          payload: { list: response.list, total: response.pagination.total, selectedRows: [], selectedRowKeys: [], searchParam: {} },
          // payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *fetch1({ payload }, { call, put }) {
        const searchParam = Object.assign({
          typec: 2,
        })
        yield put({
          type: 'changeState',
          payload: { loading: true },
          searchParam,
        })
        const response = yield call(getWarehouseWmInOutData, payload)
        console.log(response, searchParam)
        yield put({
          type: 'changeState',
          // payload: response,
          payload: { list: response.list, total: response.pagination.total, selectedRows: [], selectedRowKeys: [], searchParam: searchParam },
          // payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *getWarehouse(_, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getWarehouse, {})
        yield put({
          type: 'warehouse',
          payload: response,
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *search({ payload }, { call, put, select }) {
        const sear =  yield select(state => state.mainStorehouse.searchParam)
        const statePage = yield select(state => state.mainStorehouse.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.mainStorehouse.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const start = searchParam.beginBillDate === undefined ? undefined : moment(searchParam.beginBillDate).format('YYYY-MM-DD')
        const end = searchParam.endBillDate === undefined ? undefined : moment(searchParam.endBillDate).format('YYYY-MM-DD')
        Object.assign(searchParam, { beginBillDate: start, endBillDate: end })
        if (sear.typec === undefined) {
          const response = yield call(getWmInOut, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
          })
        } else {
          const response = yield call(getWarehouseWmInOutData, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
          })
        }
      },
      *exportDetail({ payload }, { call }) {
        yield call(exportDetail, payload)
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [], isRadio: false, searchParam: {}, page: {} },
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

      save(state, payload) {
        return {
          ...state,
          selectedRowKeys: payload.payload.selectedRowKeys,
        }
      },

      deleteChoose(state, payload) {
        return {
          ...state,
          selectedRowKeys: payload.payload.selectedRowKeys,
        }
      },
      warehouse(state, payload) {
        return {
          ...state,
          warehouses: payload.payload,
        }
      },
    },
}
