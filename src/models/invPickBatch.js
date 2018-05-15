import { getBatchSummary, getOperateUser } from '../services/inventory/pickBatch'

export default {
  namespace: 'pickBatch',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
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
      // const list = yield select(state => state.pickBatch.list)
      // const searchParam = yield select(state => state.pickBatch.searchParam)
      // if (!(list && list.length)) {
        // Object.assign(searchParam, payload)
        const response = yield call(getBatchSummary)
        // , searchParam
        const users = yield call(getOperateUser)
        const operateUsers = []
        Object.keys(users).forEach((k) => {
          operateUsers.push(users[k])
        })
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, operateUsers },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.pickBatch.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.pickBatch.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getBatchSummary, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
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
