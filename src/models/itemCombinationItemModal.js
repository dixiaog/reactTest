import { getCombinationDelete, getData } from '../services/capacity'

export default {
    namespace: 'combinationItemModal',

    state: {
      list: [],
      total: 0,
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      lists: [],
      ids: [],
    },

    effects: {
    *delete({ payload }, { call, put }) {
      const response = yield call(getCombinationDelete, payload)
      // getCommonItem
      yield put({
        type: 'changeState',
        payload: response,
      })
    },
    *import({ payload }, { call, put }) {
      const response = yield call(getCombinationDelete, payload)
      yield put({
        type: 'changeState',
        payload: response,
      })
    },
    *saveAll({ payload }, { call, put }) {
      const response = yield call(getCombinationDelete, payload)
      yield put({
        type: 'changeState',
        payload: response,
      })
    },
    *clean(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { selectedRows: [], selectedRowKeys: [] },
      })
    },
    *getdata({ payload }, { call, put }) {
      const response = yield call(getData, payload)
      const array = []
      response.forEach((element) => {
        array.push(element.skuNo)
      })
      console.log('response', response)
      yield put({
        type: 'getList',
        payload: { list: response, ids: array },
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
      getList(state, { payload }) {
        return {
          ...state,
          lists: payload.list,
          ids: payload.ids,
        }
      },
    },
}
