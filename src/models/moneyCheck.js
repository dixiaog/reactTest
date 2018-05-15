import { getDistributorList, getOrderSearchData, updateOrderStatistics, getSearchInit } from '../services/order/search'

export default {
  namespace: 'moneyCheck',

  state: {
    list: [],
    total: 0,
    loading: false,
    // 下面需要的
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    statisticsData: {},
    distributorList: [],
    initData: {},
    defaultActiveKey: [],
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const list = yield select(state => state.moneyCheck.list)
      const searchParam = yield select(state => state.moneyCheck.searchParam)
      Object.assign(searchParam, 
        searchParam.prefix1 ? { [searchParam.prefix1]: searchParam.postfix1 } : { 'siteOrderNo': searchParam.postfix1 },
        searchParam.prefix2 ? { [searchParam.prefix2]: searchParam.postfix2 } : { 'siteBuyerNo': searchParam.postfix2 },
        searchParam.prefix3 ? { [searchParam.prefix3]: searchParam.postfix3 } : { 'skuNo': searchParam.postfix3 },
        searchParam.timeField ? { timeField: searchParam.timeField } : { 'timeField': '1' },
        { orderStatuses: [10] }
      )
      if (searchParam.prefix1 && searchParam.prefix1 !== 'siteOrderNo') {
        delete searchParam.siteOrderNo
      }
      if (searchParam.prefix2 && searchParam.prefix2 !== 'siteBuyerNo') {
        delete searchParam.siteBuyerNo
      }
      if (searchParam.prefix3 && searchParam.prefix3 !== 'skuNo') {
        delete searchParam.skuNo
      }
      if (!(list && list.length)) {
        const response = yield call(getOrderSearchData, searchParam)
        const statisticsData = yield call(updateOrderStatistics)
        if (statisticsData.abnormalNos && statisticsData.abnormalNos.length) {
          statisticsData.abnormalNos.forEach((ele) => {
            Object.assign(statisticsData, { [ele.abnormalNo]: ele.number })
          })
        }
        delete statisticsData.abnormalNos
        yield put({
          type: 'changeState',
          payload: { ...searchParam, ...response, total: response.pagination.total, statisticsData },
        })
      }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.moneyCheck.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.moneyCheck.searchParam)
      Object.assign(searchParam, { orderStatuses: [10] })
      delete searchParam.prefix1
      delete searchParam.prefix2
      delete searchParam.prefix3
      delete searchParam.postfix1
      delete searchParam.postfix2
      delete searchParam.postfix3
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getOrderSearchData, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *clean({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: {
          searchParam: {},
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
      yield put({
        type: 'fetch',
      })
    },
    *statistics({ payload }, { call, put, select }) {
      const statisticsData = yield call(updateOrderStatistics)
      const initData = yield call(getSearchInit)
      const distributorList = yield call(getDistributorList)
      if (statisticsData.abnormalNos && statisticsData.abnormalNos.length) {
        statisticsData.abnormalNos.forEach((ele) => {
          Object.assign(statisticsData, { [ele.abnormalNo]: ele.number })
        })
      }
      delete statisticsData.abnormalNos
      const data = initData.OrderAbnormal
      initData.Abnormal.length && initData.Abnormal.map(ele => data.push({ index: ele.no, name: ele.name }))
      Object.assign(initData, { OrderAbnormal: data })
      yield put({
        type: 'changeState',
        payload: { statisticsData, initData, distributorList },
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
