import { list, exportSkus, postdelete } from '../services/supplier/supplier'

export default {
  namespace: 'supplier',

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
      // const list = yield select(state => state.supplier.list)
      // const searchParam = yield select(state => state.supplier.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(list)
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
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.supplier.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.supplier.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      if (searchParam.supplierName === '') {
        delete searchParam.supplierName
      }
      if (searchParam.supplierNo === '') {
        delete searchParam.supplierNo
      }
      const response = yield call(list, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *export({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.supplier.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.supplier.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(exportSkus, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page },
      })
    },
    *postdelete({ payload }, { call, put }) {
      yield call(postdelete, payload)
      yield put({
        type: 'supplier/search',
      })
    },
    *exportSku({ payload }, { call }) {
      yield call(exportSkus, payload)
      // yield put({
      //   type: 'items/search',
      // })
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
