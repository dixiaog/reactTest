/*
 * @Author: tanmengjia
 * @Date: 2017-12-25 16:31:11
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-05-08 09:22:14
 */
import { getCombinationItem, turnToOrdinary, Save, getData, exportSkuItem } from '../services/capacity'

export default {
    namespace: 'combinationItem',

    state: {
      list: [],
      total: 0,
      lists: [],
      ids: [],
      loading: false,
      searchBarProps: {},
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
        // const list = yield select(state => state.combinationItem.list)
        // const searchParam = yield select(state => state.combinationItem.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getCombinationItem)
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
        const statePage = yield select(state => state.combinationItem.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.combinationItem.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, { comboNo: searchParam.comboNo ? searchParam.comboNo.trim() : undefined,
                                     skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined,
                                     productName: searchParam.productName ? searchParam.productName.trim() : undefined,
                                     shortName: searchParam.shortName ? searchParam.shortName.trim() : undefined,
                                   })
        const response = yield call(getCombinationItem, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *change({ payload }, { call, put }) {
        const response = yield call(turnToOrdinary, payload)
        yield put({
          type: 'changeState',
          payload: response,
        })
        yield put({
          type: 'fetch',
        })
      },
      *save({ payload }, { call, put }) {
        const response = yield call(Save, payload)
        yield put({
          type: 'changeState',
          payload: response,
        })
      },
      *getdata({ payload }, { call, put }) {
        const response = yield call(getData, payload)
        const array = []
        response.forEach((element) => {
          array.push(element.skuNo)
        })
        yield put({
          type: 'getList',
          payload: { list: response, ids: array },
        })
      },
      *exportSku({ payload }, { call }) {
        yield call(exportSkuItem, payload)
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { lists: [], ids: [] },
        })
      },
      *clean1(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [] },
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
      getList(state, { payload }) {
        return {
          ...state,
          lists: payload.list,
          ids: payload.ids,
        }
      },
      skuNo(state, { payload }) {
        return {
          ...state,
          ids: payload,
        }
      },
      cleanIds(state) {
        return {
          ...state,
          ids: [],
        }
      },
    },
}
