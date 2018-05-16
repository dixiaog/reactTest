import { getRoleList, getChooseData } from '../services/system'

export default {
  namespace: 'role',

  state: {
    list: [],
    total: 0,
    page: {},
    selectedRows: [],
    selectedRowKeys: [],
    loading: false,
    searchParam: {},
    chooseData: null,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.role.searchParam)
      const page = payload && payload.page ? payload.page : Object.assign(yield select(state => state.role.page))
      const response = yield call(getRoleList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response.data, total: response.data.total, loading: false },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.role.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.role.searchParam)
      const response = yield call(getRoleList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response.data, total: response.data.total, loading: false },
      })
    },
    *getChooseData({ payload }, { call, put, select }) {
      const response = yield call(getChooseData, payload)
      yield put({
        type: 'changeState',
        payload: { chooseData: response },
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { chooseData: null },
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
