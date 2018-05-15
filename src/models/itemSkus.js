import { GetSkus, Enable, Update, ExportSku } from '../services/item/skus'

export default {
  namespace: 'skus',

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
      // const list = yield select(state => state.skus.list)
      // const searchParam = yield select(state => state.skus.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(GetSkus)
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
      const statePage = yield select(state => state.skus.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.skus.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(GetSkus, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'changeState',
        payload: { loading: false, searchParam, page, total: response.pagination.total },
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
    *update({ payload }, { call, put }) {
      const response = yield call(Update, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      // yield put({
      //   type: 'search',
      // })
    },
    // *getViewData({ payload }, { call, put }) {
    //   const response = yield call(GetViewData, { ...payload })
    //   yield put({
    //     type: 'changeState',
    //     payload: response,
    //   })
    // },
    *exportSku({ payload }, { call, select }) {
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.skus.searchParam)
      const fileName = payload && payload.fileName ? payload.fileName : '导出文件'
      yield call(ExportSku, { ...searchParam, fileName })
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
