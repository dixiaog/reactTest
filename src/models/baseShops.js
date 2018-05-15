/*
 * @Author: chenjie 
 * @Date: 2018-03-27 15:27:00 
 * 店铺
 */
import { getShoplist, getSite, enableShop } from '../services/api'

export default {
  namespace: 'shops',

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
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.shops.list)
      // const searchParam = yield select(state => state.shops.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getShoplist)
        // , searchParam
        const sites = yield call(getSite)
        yield put({
          type: 'changeState',
          payload: { ...response, sites, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.shops.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.shops.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const start = searchParam.startCreateTime === undefined ? undefined : new Date(searchParam.startCreateTime).toLocaleDateString()
      const end = searchParam.endCreateTime === undefined ? undefined : new Date(searchParam.endCreateTime).toLocaleDateString()
      Object.assign(searchParam, { startCreateTime: start, endCreateTime: end })
      const response = yield call(getShoplist, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
      })
    },
    *enable({ payload }, { call, put }) {
      const response = yield call(enableShop, payload)
      if (response) {
        yield put({
          type: 'search',
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
