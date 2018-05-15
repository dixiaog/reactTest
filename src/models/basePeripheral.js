/*
 * @Author: Wupeng
 * @Date: 2018-03-07 14:05:26
 * @Last Modified by: tanmengjia
 * 外部设备连接导入
 * @Last Modified time: 2018-05-08 09:10:47
 */
import { search } from '../services/base/peripheral/peripheral.js'

export default {
  namespace: 'peripheral',

  state: {
    list: [],
    total: 0,
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
      // const list = yield select(state => state.peripheral.list)
      // const searchParam = yield select(state => state.peripheral.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(search)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.peripheral.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.peripheral.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      if (searchParam.printerAddess === '') {
        delete searchParam.printerAddess
      }
      if (searchParam.printerPort === '') {
        delete searchParam.printerPort
      }
      const response = yield call(search, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
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
  },
}
