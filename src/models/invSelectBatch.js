/*
 * @Author: chenjie 
 * @Date: 2018-04-21 13:39:45 
 * 选择缺货的拣货批次
 */
import { getBillNoByInfo } from '../services/inventory/pickBatch'

export default {
  namespace: 'selectBatch',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    searchParam: {
      
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getBillNoByInfo, payload)
      console.log('response', response)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam: payload, total: response.pagination.total },
      })
    },

    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.nobill.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.nobill.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getBillNoByInfo, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, total: response.pagination.total},
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
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
