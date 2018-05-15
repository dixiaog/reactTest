import { list } from '../services/inventory/stockinventory'

export default {
    namespace: 'stockinventory',

    state: {
      list: [],
      total: 0,
      chooseRows: [],
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
    },

    effects: {
      *fetch({payload}, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.stockinventory.list)
        const searchParam = yield select(state => state.stockinventory.searchParam)
        // const searchParam = yield select(state => state.inventory.searchParam)
        const response = yield call(list, searchParam)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.stockinventory.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.stockinventory.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        if (searchParam.autoNo === '') {
          delete searchParam.autoNo
        }
        if (searchParam.skuNo === '') {
          delete searchParam.skuNo
        }
        const response = yield call(list, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
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
