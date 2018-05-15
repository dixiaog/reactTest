import { getDistributorList, getOrderSearchData, updateOrderStatistics, getSearchInit, getShop, getAbnormal, getForbidList } from '../services/order/search'

export default {
    namespace: 'search',

    state: {
      list: [],
      total: 0,
      loading: false,
      // 下面需要的
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      initData: {},
      shopList: [],
      statisticsData: {},
      abnormalList: [], // 异常信息
      list1: [],
      forbidList: [], // 禁用商品列表
      distributorList: [],
      usedAbnormal: [],
      defaultActiveKey: [],
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const list = yield select(state => state.search.list)
        const searchParam = yield select(state => state.search.searchParam)
        Object.assign(searchParam, 
          searchParam.prefix1 ? { [searchParam.prefix1]: searchParam.postfix1 } : { 'siteOrderNo': searchParam.postfix1 },
          searchParam.prefix2 ? { [searchParam.prefix2]: searchParam.postfix2 } : { 'siteBuyerNo': searchParam.postfix2 },
          searchParam.prefix3 ? { [searchParam.prefix3]: searchParam.postfix3 } : { 'skuNo': searchParam.postfix3 },
          searchParam.timeField ? { timeField: searchParam.timeField } : { 'timeField': '1' }
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
          const responseA = yield call(getAbnormal)
          const response = yield call(getOrderSearchData, searchParam)
          const shopList = yield call(getShop, {})
          const forbidList = yield call(getForbidList, {})
          // 获取当前使用的自定义异常信息集合
          const usedAbnormal = []
          response.list.length && response.list.forEach((ele) => {
            if(!((ele.abnormalNo >= 1 && ele.abnormalNo <= 19) || ele.abnormalNo === 0)) {
              const index = usedAbnormal.findIndex(e => e === ele.abnormalName)
              if (index === -1) {
                usedAbnormal.push(ele.abnormalName)
              }
            }
          })
          yield put({
            type: 'changeState',
            payload: { ...searchParam, usedAbnormal, abnormalList: responseA, ...response, forbidList, total: response.pagination.total, shopList },
          })
        }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *search({ payload }, { call, put, select }) {
        // console.log('payloadpayload', payload)
        const statePage = yield select(state => state.search.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.search.searchParam)
        // delete searchParam.prefix1
        // delete searchParam.prefix2
        // delete searchParam.prefix3
        // delete searchParam.postfix1
        // delete searchParam.postfix2
        // delete searchParam.postfix3
        // console.log('pagepagepage', page)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getOrderSearchData, { ...searchParam, ...page })
        const responseA = yield call(getOrderSearchData, {})
        // 获取当前使用的自定义异常信息集合
        const usedAbnormal = []
        responseA.list.length && responseA.list.forEach((ele) => {
          if(!((ele.abnormalNo >= 1 && ele.abnormalNo <= 19) || ele.abnormalNo === 0)) {
            const index = usedAbnormal.findIndex(e => e === ele.abnormalName)
            if (index === -1) {
              usedAbnormal.push(ele.abnormalName)
            }
          }
        })
        yield put({
          type: 'changeState',
          payload: { usedAbnormal, ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *clean({ payload }, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: {
            searchParam: {},
            selectedRows: [],
            selectedRowKeys: [],
            page: {},
          },
        })
        yield put({
          type: 'search',
        })
      },
      *cleanPage({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { ...payload },
        })
        yield put({
          type: 'search',
        })
      },
      *statistics({ payload }, { call, put, select }) {
        const statisticsData = yield call(updateOrderStatistics)
        if (statisticsData.abnormalNos && statisticsData.abnormalNos.length) {
          statisticsData.abnormalNos.forEach((ele) => {
            Object.assign(statisticsData, { [ele.abnormalNo]: ele.number })
          })
        }
        delete statisticsData.abnormalNos
        const initData = yield call(getSearchInit)
        const data = initData.OrderAbnormal
        initData.Abnormal.length && initData.Abnormal.map(ele => data.push({ index: ele.no, name: ele.name }))
        Object.assign(initData, { OrderAbnormal: data })
        const distributorList = yield call(getDistributorList)
        yield put({
          type: 'changeState',
          payload: { statisticsData, initData, distributorList },
        })
      },
      *fetch1({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        yield put({
          type: 'changeState',
          payload: {
            list: payload,
            loading: false,
            total: payload.length,
            page: { pageSize: 20, current: 1 },
          },
        })
      },
      *getAbnormal(_, { call, put }) {
        yield put({
          type: 'update',
        })
        const response = yield call(getAbnormal)
        yield put({
          type: 'changeState',
          payload: { abnormalList: response },
        })
        const initData = yield call(getSearchInit)
        const data = initData.OrderAbnormal
        initData.Abnormal.length && initData.Abnormal.map(ele => data.push({ index: ele.no, name: ele.name }))
        Object.assign(initData, { OrderAbnormal: data })
        yield put({
          type: 'changeState',
          payload: { initData },
        })
      },
      *update(_, { call, put }) {
        const statisticsData = yield call(updateOrderStatistics)
        if (statisticsData.abnormalNos && statisticsData.abnormalNos.length) {
          statisticsData.abnormalNos.forEach((ele) => {
            Object.assign(statisticsData, { [ele.abnormalNo]: ele.number })
          })
        }
        delete statisticsData.abnormalNos
        yield put({
          type: 'changeState',
          payload: { statisticsData },
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
