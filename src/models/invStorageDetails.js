import { getStorageDetails } from '../services/inventory/storage'

export default {
  namespace: 'storageDetails',

  state: {
    list: [],
    total: 0,
    loading: false,
    initKey: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getStorageDetails, payload)
      // 保存首次获取到的数据的key，以此来判断子页面是否禁止
      const keys = []
      response.list.forEach((ele) => {
        keys.push(ele.skuNo)
      })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, initKey: keys, total: response.pagination.total },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.storageDetails.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.storageDetails.searchParam)
      const searchBillNo = yield select(state => state.storage.billNo)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getStorageDetails, { ...searchParam, ...page, billNo: searchBillNo })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
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
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
