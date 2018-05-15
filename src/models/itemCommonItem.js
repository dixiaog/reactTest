/*
 * @Author: tanmengjia
 * @Date: 2017-12-23 16:16:59
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-08 09:22:55
 */
import { getCommonItem, getCommonEnable, exportCommonItem, exportCommonItem1 } from '../services/capacity'
import { getAllBrand, getSkuDataByPNo } from '../services/item/items'

export default {
    namespace: 'commonItem',

    state: {
      list: [],
      total: 0,
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      
      brands: [],
      lists: [],
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.commonItem.list)
        // const searchParam = yield select(state => state.commonItem.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getCommonItem)
          // , searchParam
          const brands = yield call(getAllBrand)
          yield put({
            type: 'changeState',
            payload: { ...response, brands, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.commonItem.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.commonItem.searchParam)
        Object.assign(searchParam, { listPrivate: searchParam.listPrivate && searchParam.listPrivate.length ? searchParam.listPrivate : undefined })
        Object.assign(searchParam, { skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined,
                                     productName: searchParam.productName ? searchParam.productName.trim() : undefined,
                                     supplierSkuNo: searchParam.supplierSkuNo ? searchParam.supplierSkuNo.trim() : undefined,
                                     supplierProductNo: searchParam.supplierProductNo ? searchParam.supplierProductNo.trim() : undefined,
                                     shortName: searchParam.shortName ? searchParam.shortName.trim() : undefined,
                                     productSpec: searchParam.productSpec ? searchParam.productSpec.trim() : undefined,
                                    })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getCommonItem, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
        })
      },
      *reSet(_, { call, put }) {
        const brands = yield call(getAllBrand)
        yield put({
          type: 'changeState',
          payload: { brands },
        })
      },
      *clear(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { lists: [] },
        })
      },
      *getSkuDataByPNo({ payload }, { call, put }) {
        const response = yield call(getSkuDataByPNo, payload)
        const array = []
        yield put({
          type: 'getList',
          payload: { list: response, ids: array },
        })
      },
      *enable({ payload }, { call, put }) {
        const response = yield call(getCommonEnable, payload)
        yield put({
          type: 'changeState',
          payload: response,
        })
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [] },
        })
      },
      *exportSku({ payload }, { call }) {
        yield call(exportCommonItem, payload)
      },
      *exportSku1({ payload }, { call }) {
        yield call(exportCommonItem1, payload)
      },
    },

    reducers: {
      changeState(state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },
      cleanIds(state) {
        return {
          ...state,
          selectedRows: [],
          selectedRowKeys: [],
          searchParam: {},
        }
      },
      getList(state, { payload }) {
        return {
          ...state,
          lists: payload.list,
          ids: payload.ids,
        }
      },
    },
}
