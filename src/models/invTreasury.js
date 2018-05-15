/*
 * @Author: Wupeng
 * @Date: 2018-03-07 14:05:26
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-05-08 10:07:19
 *销售出库
 */
import { list, exportDB } from '../services/base/treasury/treasury.js'

export default {
  namespace: 'treasury',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam:{},
  },

  effects: {
    *fetch({payload}, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.treasury.list)
      const searchParam = yield select(state => state.treasury.searchParam)
      Object.assign(searchParam, payload)
      // if (!(list && list.length)) {
        const response = yield call(list, {...searchParam})
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.treasury.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.treasury.searchParam)
      if (searchParam.orderNo === '') {
        Object.assign(searchParam,{
          orderNo: undefined,
        })
      }
      if (searchParam.siteOrderNo === '') {
        Object.assign(searchParam,{
        siteOrderNo: undefined,          
        })
      }
      if (searchParam.billNo === '') {
        Object.assign(searchParam, {
        billNo: undefined,          
        })
      }
      if (searchParam.buyerRemark === '') {
        delete searchParam.buyerRemark
      }
      if (searchParam.expressNo === '') {
        Object.assign(searchParam,{
        expressNo: undefined,          
        })
      }
      if (searchParam.skuNo === '') {
        Object.assign(searchParam, {
        skuNo: undefined,          
        })
      }
      if (searchParam.productNo === '') {
        Object.assign(searchParam,{
        productNo: undefined,          
        })
      }
      if (payload.searchParam.endBillDate === undefined) {
        Object.assign(searchParam,{
          endBillDate: undefined,
        })
      }
      if (payload.searchParam.startBillDate === undefined) {
        Object.assign(searchParam,{
          startBillDate: undefined,
        })
      }
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(list, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      })
    },
    *exportDB({ payload }, { call }) {
      yield call(exportDB, payload)
      // yield put({
      //   type: 'items/search',
      // })
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
