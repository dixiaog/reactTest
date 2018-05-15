import { getPowerlist, getGrouplist, delPower } from '../services/system'

export default {
  namespace: 'power',

  state: {
    list: [],
    total: 0,
    loading: false,
    groupList: [],
    selectedRows: [],
    selectedRowKeys: [],
    page: {
      current: 1,
      pageSize: 20,
    },
    searchParam: {},
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: true },
    //   })
    //   const response = yield call(getPowerlist)
    //   yield put({
    //     type: 'changeState',
    //     payload: { ...response, loading: false },
    //   })
    // //   yield put({
    // //     type: 'changeState',
    // //     payload: { loading: false },
    // //   })
    // },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.power.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.power.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getPowerlist, { ...searchParam, ...page })
      let groupList = yield call(getGrouplist)
      let list = []
      let total = 0
      if (!(response === null)) {
        list = response.list
        total = response.pagination.total
      }
      if (!groupList) {
        groupList = []
      }
      yield put({
        type: 'changeState',
        payload: { list, loading: false, searchParam, page, groupList, total },
      })
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(delPower, payload)
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
