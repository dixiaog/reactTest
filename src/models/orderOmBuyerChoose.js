import { getOmBuyer } from '../services/order/omBuyer'
import { getSite } from '../services/api'

export default {
    namespace: 'omBuyerChoose',

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
      sites: [],
      tabelToolbarJ: false,
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const searchParam = yield select(state => state.omBuyer.searchParam)
        const response = yield call(getOmBuyer, searchParam)
        const sites = yield call(getSite)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [], sites, searchParam: {}, total: response.pagination.total },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.omBuyerChoose.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.omBuyerChoose.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, { receiver: searchParam.receiver ? searchParam.receiver.trim() : undefined,
                                     siteBuyerNo: searchParam.siteBuyerNo ? searchParam.siteBuyerNo.trim() : undefined})
        const response = yield call(getOmBuyer, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
        })
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [], searchParam: {} },
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
