import { getSupPriceData, getDefaultData } from '../services/supplySell/supplierPrice'

export default {
  namespace: 'supplierPrice',

  state: {
    list: [],
    total: 0,
    loading: false,
    defaultData: {},
    // 下面4个必选
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
      // const list = yield select(state => state.supplierPrice.list)
      // const searchParam = yield select(state => state.supplierPrice.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getSupPriceData)
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.supplierPrice.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.supplierPrice.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true, selectedRows: [], selectedRowKeys: [] },
      })
      const response = yield call(getSupPriceData, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *getDefault({ payload }, { call, put }) {
      const response = yield call(getDefaultData, payload)
      let t = null
      if (response) {
        t = response
      } else {
        t = {}
      }
      yield put({
        type: 'changeState',
        payload: { defaultData: t },
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
