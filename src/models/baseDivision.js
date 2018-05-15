import { getWarehouseSkuInventoryData, exportSku, getIsLessThanSafeStock } from '../services/division/division'

export default {
  namespace: 'division',

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
      // const list = yield select(state => state.division.list)
      // const searchParam = yield select(state => state.division.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getWarehouseSkuInventoryData)
        // , searchParam
        // console.log(response)
        yield put({
          type: 'changeState',
          payload: { ...response, total: (response === null) ? 0 : response.pagination.total, list: (response === null) ? [] : response.list },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { selectedRows: [], selectedRowKeys: [], searchParam: {}, loading: false },
      })
    },
    //  getIsLessThanSafeStock
    *selected(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getIsLessThanSafeStock)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.division.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.division.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      if (searchParam.beginNum === '' || searchParam.beginNum === null) {
        delete searchParam.beginNum
      }
      if (searchParam.endNum === '' || searchParam.endNum === null) {
        delete searchParam.endNum
      }
      if (searchParam.productName === '') {
        delete searchParam.productName
      }
      if (searchParam.productNo === '') {
        delete searchParam.productNo
      }
      if (searchParam.skuNo === '') {
        delete searchParam.skuNo
      }
      const response = yield call(getWarehouseSkuInventoryData, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page },
      })
    },
    *secet(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getIsLessThanSafeStock)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    *export({ payload }, { call, select }) {
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.division.searchParam)
      const fileName = '库存分仓明细导出.xls'
      yield call(exportSku, { ...searchParam, fileName })
      // this.props.dispatch({
      //   type: 'division/search',
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
