import { getOmBuyer } from '../services/order/omBuyer'
import { getSite } from '../services/api'

export default {
    namespace: 'omBuyer',

    state: {
      tabelToolbarJ: false, // 控制是否展示新增按钮
      list: [],
      total: 0,
      chooseRows: [],
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      sites: [],
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.omBuyer.list)
        // const searchParam = yield select(state => state.omBuyer.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getOmBuyer)
          // , searchParam
          const sites = yield call(getSite)
          yield put({
            type: 'changeState',
            payload: { ...response, sites, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.omBuyer.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.omBuyer.searchParam)
        Object.assign(searchParam, { receiver: searchParam.receiver ? searchParam.receiver.trim() : undefined,
                                     siteBuyerNo: searchParam.siteBuyerNo ? searchParam.siteBuyerNo.trim() : undefined,
                                     mobileNo: searchParam.mobileNo ? searchParam.mobileNo.trim() : undefined })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getOmBuyer, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [], total: response.pagination.total },
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
