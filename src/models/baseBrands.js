/*
 * @Author: Chen Xinjie
 * @Date: 2017-12-28 15:52:38
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-08 09:08:47
 * 品牌资料维护
 */
import { GetBrands, Save, Update, GetViewData, Enable } from '../services/base/brands'

export default {
  namespace: 'brands',

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
      // const list = yield select(state => state.brands.list)
      // const searchParam = yield select(state => state.brands.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(GetBrands)
        // , searchParam
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
      const statePage = yield select(state => state.brands.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.brands.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(GetBrands, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
      })
    },
    *enable({ payload }, { call, put }) {
      const response = yield call(Enable, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'search',
      })
    },
    *save({ payload }, { call, put }) {
      const response = yield call(Save, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'search',
      })
    },
    *update({ payload }, { call, put }) {
      const response = yield call(Update, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'search',
      })
    },
    *getViewData({ payload }, { call, put }) {
      const response = yield call(GetViewData, { ...payload })
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
