/*
 * @Author: Wupeng
 * @Date: 2018-04-27 09:02:53 
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-08 09:17:04
 * 期初库存接口
 */
import { selectList, nullifyStatus, deleteByBillNo } from '../services/opening/opening'

export default {
  namespace: 'opening',

  state: {
    list: [],
    loading: false,
    brands: [],
    searchBarProps: {},
    total: 0,
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
      // const list = yield select(state => state.opening.list)
      // const searchParam = yield select(state => state.opening.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(selectList)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, list: response.list },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *paramNome({ payload }, { put }) {
      yield put({
        type: 'changeState',
        payload: { searchParam: {
          ...payload,
        } },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.opening.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.opening.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      if (searchParam.skuNo === '') {
        delete searchParam.skuNo
      }
      const response = yield call(selectList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page, selectedRows: [], selectedRowKeys: [] },
      })
    },
    // nullifyStatus
    *nullifyStatus({ payload }, { call, put }) {
      yield call(nullifyStatus, payload)
      yield put({
        type: 'opening/search',
      })
    },
     // nullifyStatus
     *deleteByBillNo({ payload }, { call, put }) {
      yield call(deleteByBillNo, payload)
      yield put({
        type: 'opening/search',
      })
    },
  },
  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
