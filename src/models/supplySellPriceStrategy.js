import moment from 'moment'
import { getSpecialPrice, getStrategyChild, exportStrategy, getChooseData } from '../services/supplySell/priceStrategy'
import { getRelData } from '../services/supplySell/relationship'

export default {
    namespace: 'priceStrategy',

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
      childs: [],
      distributor: [],
      childs1: [],
      chooseData: null,
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.priceStrategy.list)
        // const searchParam = yield select(state => state.priceStrategy.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getSpecialPrice)
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
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.priceStrategy.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.priceStrategy.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const start = searchParam.beginTime === undefined || searchParam.beginTime === null ? undefined : moment(searchParam.beginTime).format('YYYY-MM-DD')
        const end = searchParam.endTime === undefined || searchParam.endTime === null ? undefined : moment(searchParam.endTime).format('YYYY-MM-DD')
        Object.assign(searchParam, { beginTime: start, endTime: end })
        Object.assign(searchParam, { strategyName: searchParam.strategyName ? searchParam.strategyName.trim() : undefined,
                                     skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined })
        const response = yield call(getSpecialPrice, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, total: response.pagination.total, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *getChild({ payload }, { call, put }) {
        const response = yield call(getStrategyChild, payload)
        const child = response
        if (child && child.length) {
          child.forEach((ele) => {
            Object.assign(ele, { product: ele.productName.concat('/', ele.productSpec) })
          })
          yield put({
            type: 'getChild1',
            payload: child,
          })
        }
        yield put({
          type: 'getChilds',
          payload: response,
        })
      },
      *getChooseData({ payload }, { call, put }) {
        const response = yield call(getChooseData, payload)
        yield put({
          type: 'chooseData',
          payload: response,
        })
      },
      *cleanChild(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { childs: [] },
        })
      },
      *exportStrategy({ payload }, { call }) {
        yield call(exportStrategy, payload)
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
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { childs: [], childs1: [], chooseData: null },
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
      getChilds(state, { payload }) {
        return {
          ...state,
          childs: payload,
        }
      },
      getChild1(state, { payload }) {
        return {
          ...state,
          childs1: payload,
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
