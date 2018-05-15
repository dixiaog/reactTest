import { getDictionary, getTypes, deleteDictionary } from '../services/system'

export default {
  namespace: 'dictionary',

  state: {
    list: [],
    total: 0,
    loading: false,
    types: [], // 存放数据字典类别
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
      // const list = yield select(state => state.dictionary.list)
      // const searchParam = yield select(state => state.dictionary.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getDictionary)
        const responseT = yield call(getTypes)
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, types: responseT },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.dictionary.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.dictionary.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getDictionary, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, searchParam, page },
      })
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(deleteDictionary, payload)
      if (response) {
        yield put({
          type: 'search',
        })
      }
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
