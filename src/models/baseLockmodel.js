import { previewStoragelocationPickingPriority } from '../services/position/position'

export default {
  namespace: 'lockmodel',

  state: {
    list: [],
    treeData: [],
    loading: false,
    brands: [],
    searchBarProps: {},
    total: 0,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    warehouseNo: null,
    locationType: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
        },
      })
      const response = yield call(previewStoragelocationPickingPriority, payload)
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          warehouseNo: payload.warehouseNo,
        },
      })
    },
      *search({ payload }, { call, put, select }) {
      const warehouseNo = yield select(state => state.position.warehouseNo)
      const locationType = yield select(state => state.position.locationType)
      const page = payload && payload.page ? payload.page : yield select(state => state.position.page)
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
        },
        // warehouseNo: payload.warehouseNo,
        // locationType: payload.locationType,
      })
      const response = yield call(previewStoragelocationPickingPriority, { ...page, warehouseNo, locationType })
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          page,
          selectedRows: [],
          selectedRowKeys: [],
        },
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
