export default {
    namespace: 'viewLog',

    state: {
      list: [],
      total: 0,
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
    },

    effects: {
      *fetch(_, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call()
        yield put({
          type: 'changeState',
          payload: response,
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
    //   *search({ payload }, { call, put, select }) {
    //     const page = payload.page ? payload.page : yield select(state => state.commonItemImport.page)
    //     const searchParam = payload.searchParam ? payload.searchParam : yield select(state => state.commonItemImport.searchParam)
    //     yield put({
    //       type: 'changeState',
    //       payload: { loading: true },
    //     })
    //     const response = yield call(getImportItem, { searchParam, page })
    //     yield put({
    //       type: 'changeState',
    //       payload: response,
    //     })
    //     yield put({
    //       type: 'changeState',
    //       payload: { loading: false, searchParam, page },
    //     })
    //   },
    //   *change({ payload }, { call, put }) {
    //     const { id } = payload
    //     console.log('change id', id)
    //   },
    },

    reducers: {
      changeState(state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },
      // changeLoading(state, action) {
      //   return {
      //     ...state,
      //     loading: action.payload,
      //   }
      // },

    },
}