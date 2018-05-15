/*
 * @Author: tanmengjia
 * @Date: 2017-12-26 10:39:15
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-29 16:44:22
 */
import { getLocationItem, binding } from '../services/capacity'

export default {
  namespace: 'itemLocation',

  state: {
    list: [],
    total: 0,
    loading: true,
    searchBarProps: {},
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getLocationItem)
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total },
      })
      yield put({
        type: 'changeState',
        payload: { loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.itemLocation.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.itemLocation.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getLocationItem, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      })
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(getLocationItem)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false },
      })
    },
    *deleteAll({ payload }, { call, put }) {
      const response = yield call(getLocationItem)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false },
      })
    },
    *binding({ payload }, { call, put }) {
      const response = yield call(binding, payload)
      yield put({
        type: 'changeState',
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
  },
}
