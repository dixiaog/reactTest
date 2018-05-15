import { selectAttributeByEnableStatus } from '../services/category/category'
// selectAttributeByEnableStatus

export default {
  namespace: 'edit',
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
    categoryNo: null,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
          categoryNo: payload.categoryNo,
        },
      })
      const response = yield call(selectAttributeByEnableStatus, payload)
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          page: [],
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
    },
    *entdsh({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
          page: [],
        },
      })
      const response = yield call(selectAttributeByEnableStatus, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page: [1, response.list.length] },
      })
    },
    *search({ payload }, { call, put, select }) {
      const categoryNo = payload && payload.categoryNo ? payload.categoryNo : yield select(state => state.edit.categoryNo)
      const page = payload && payload.page ? payload.page : yield select(state => state.edit.page)
      const enableStatus = payload && payload.enableStatus ? payload.enableStatus : yield select(state => state.edit.enableStatus)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectAttributeByEnableStatus, { ...page, categoryNo, enableStatus })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list, page },
      })
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
