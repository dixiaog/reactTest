import { getFundAuditList } from '../services/supplySell/accountBalance'

export default {
    namespace: 'fundAudit',

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
      disSupTypeNo: null,
      fundType: null,
      distributorNo: null,
    },

    effects: {
      *fetch({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getFundAuditList, payload)
        if (response !== null) {
          yield put({
            type: 'changeState',
            payload: { ...response, total: response.pagination.total, loading: false },
          })
        } else {
          yield put({
            type: 'changeState',
            payload: { loading: false },
          })
        }
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.fundAudit.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.fundAudit.searchParam)
        // Object.assign(searchParam, {
        //   disSupTypeNo: yield select(state => state.fundAudit.disSupTypeNo),
        //   fundType: yield select(state => state.fundAudit.fundType),
        //   distributorNo: yield select(state => state.fundAudit.distributorNo),
        // })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getFundAuditList, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { list: [], searchParam: [], page: [], selectedRows: [], selectedRowKeys: [] },
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
