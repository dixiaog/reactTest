/*
 * @Author: chenjie 
 * @Date: 2018-03-27 15:26:35 
 * 打印模板
 */
import { getPrints, getDefault, getTypes, getTemp } from '../services/api'

export default {
  namespace: 'prints',

  state: {
    list: [],
    total: 0,
    types: [],
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
      // const list = yield select(state => state.prints.list)
      // const searchParam = yield select(state => state.prints.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getPrints)
        // , searchParam
        const responseType = yield call(getTypes)
        console.log('打印模板列表', response)
        console.log('模板类型数据', responseType)
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, types: responseType },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.prints.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.prints.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getPrints, { ...searchParam, ...page })
      console.log('打印搜索结果', response)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
      })
    },
    *isDefault({ payload }, { call, put, select }) {
      const params = yield select(state => state.prints.selectedRows[0].autoNo)
      const response = yield call(getDefault, Object.assign(payload, { autoNo: params }))
      if (response) {
        yield put({
          type: 'search',
        })
      }
    },
    *temp({ payload }, { call, put }) {
      const response = yield call(getTemp, payload)
      console.log('模板数据', response)
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
