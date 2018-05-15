/*
 * @Author: chenjie 
 * @Date: 2018-03-27 15:27:00 
 * 店铺
 */
import { searchInterfaceLog } from '../services/system'

export default {
  namespace: 'shopInterfaceLog',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    sites: [],
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(searchInterfaceLog, payload)
      console.log('response', response)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, searchParam: payload },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.shopInterfaceLog.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.shopInterfaceLog.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(searchInterfaceLog, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
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
