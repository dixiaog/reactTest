import { getProductLimit, getChooseData } from '../services/supplySell/productLimit'
import { getRelData } from '../services/supplySell/relationship'

export default {
    namespace: 'productLimit',

    state: {
      list: [],
      lists: [],
      total: 0,
      chooseRows: [],
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      distributor: [],
      chooseData: null,
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.productLimit.list)
        // const searchParam = yield select(state => state.productLimit.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getProductLimit)
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *getDistributor(_, { call, put }) {
        const customer = []
        const response = yield call(getRelData, { status: 1 })
        if (response.list && response.list.length) {
          response.list.forEach((ele) => {
            customer.push({ distributorNo: ele.distributorNo, distributorName: ele.distributorName })
          })
        }
        yield put({
          type: 'distributor',
          payload: customer,
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.productLimit.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.productLimit.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, { productNo: searchParam.productNo ? searchParam.productNo.trim() : undefined })
        const response = yield call(getProductLimit, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, total: response.pagination.total, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *getChooseData({ payload }, { call, put }) {
        const response = yield call(getChooseData, payload)
        yield put({
          type: 'chooseData',
          payload: response,
        })
      },
      *clear(_, { put }) {
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
      distributor(state, { payload }) {
        return {
          ...state,
          distributor: payload,
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
