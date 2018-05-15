import { getAuthorize, getChooseData } from '../services/system'
// 平台站点维护
export default {
  namespace: 'authorize',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    chooseData: {},
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.authorize.list)
      // const searchParam = yield select(state => state.authorize.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getAuthorize)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: false },
    //   })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.authorize.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.authorize.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getAuthorize, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      })
    },
    *getChooseData({ payload }, { call, put }) {
      const response = yield call(getChooseData, { ...payload })
      yield put({
        type: 'chooseData',
        payload: response,
      })
    },
    *clear(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { chooseData: {} },
      })
    },

    // *delete({ payload }, { call, put }) {
    //   const { id } = payload
    //   console.log('delete id', id)
    //   // yield put({
    //   //   type: 'changeState',
    //   //   payload: { loading: true },
    //   // })
    //   // const response = yield call(getPowers)
    //   // yield put({
    //   //   type: 'changeState',
    //   //   payload: response,
    //   // })
    //   // yield put({
    //   //   type: 'changeState',
    //   //   payload: { loading: false },
    //   // })
    // },
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    chooseData(state, { payload }) {
      return {
        ...state,
        chooseData: payload,
      }
    },
  },
}
