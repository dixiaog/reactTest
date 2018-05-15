import moment from 'moment'
import { getCommisionStrategy, getFxLevelMax, getChooseData } from '../services/supplySell/commisionStrategy'
import { getRelData } from '../services/supplySell/relationship'

export default {
    namespace: 'commisionStrategy',

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
      fxLevelMax: {},
      chooseData: null,
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.commisionStrategy.list)
        // const searchParam = yield select(state => state.commisionStrategy.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getCommisionStrategy)
          const fxLevelMax1 = yield call(getFxLevelMax)
          yield put({
            type: 'changeState',
            payload: { ...response, total: response.pagination.total },
          })
          yield put({
            type: 'changeFxLevelMax',
            payload: { ...fxLevelMax1 },
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
        const statePage = yield select(state => state.commisionStrategy.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.commisionStrategy.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const start = searchParam.beginTime === undefined || searchParam.beginTime === null ? undefined : moment(searchParam.beginTime).format('YYYY-MM-DD')
        const end = searchParam.endTime === undefined || searchParam.endTime === null ? undefined : moment(searchParam.endTime).format('YYYY-MM-DD')
        Object.assign(searchParam, { beginTime: start, endTime: end })
        Object.assign(searchParam, { strategyName: searchParam.strategyName ? searchParam.strategyName.trim() : undefined })
        const response = yield call(getCommisionStrategy, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, total: response.pagination.total, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [], isRadio: false },
        })
      },
      *getChooseData({ payload }, { call, put }) {
        const response = yield call(getChooseData, { ...payload })
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
      changeFxLevelMax(state, { payload }) {
        return {
          ...state,
          fxLevelMax: payload.paramValue,
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
