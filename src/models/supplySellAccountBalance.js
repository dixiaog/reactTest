import { getCreditList, exportDisInfo } from '../services/supplySell/accountBalance'

export default {
    namespace: 'accountBalance',

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
        const response = yield call(getCreditList, payload)
        yield put({
          type: 'changeState',
          payload: {
            ...response,
            total: response && response.pagination ? response.pagination.total : 0,
            loading: false,
            searchParam: payload,
          },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.accountBalance.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.accountBalance.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getCreditList, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, total: response && response.pagination ? response.pagination.total : 0 , loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *export({ payload }, { call }) {
        // const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.accountBalance.searchParam)
        // const response = yield call(exportContactDetails, { ...searchParam })
        yield call(exportDisInfo, payload)
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
