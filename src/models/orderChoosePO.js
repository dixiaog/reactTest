import { getPO } from '../services/order/vipOutWh'

export default {
    namespace: 'choosePO',

    state: {
      list: [],
      total: 0,
      chooseRows: [],
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      warehouses: [],
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getPO)
        if (response !== null) {
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.choosePO.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.choosePO.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getPO, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
        })
      },
      *clear(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [] },
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
