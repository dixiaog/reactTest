import { getContactDetails, exportContactDetails } from '../services/supplySell/accountBalance'

export default {
    namespace: 'contactDetail',

    state: {
      list: [],
      lists: [],
      total: 0,
      chooseRows: [],
      loading: false,
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
        const response = yield call(getContactDetails, payload)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam: payload, total: response.pagination.total },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.contactDetail.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.contactDetail.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getContactDetails, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
        })
      },
      *export({ payload }, { call }) {
        yield call(exportContactDetails, payload)
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { searchParam: {}, page: {}, selectedRows: [], selectedRowKeys: [] },
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
