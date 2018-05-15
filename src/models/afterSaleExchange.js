import { selectBdSkuByAsOrderNo } from '../services/aftersale/afterSearch'

export default {
  namespace: 'exchange',

  state: {
    list: [],
    total: 0,
    loading: false,
    initKey: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectBdSkuByAsOrderNo, payload)
      const keys = []
      response.forEach((ele) => {
        keys.push(ele.skuNo)
      })
      yield put({
        type: 'changeState',
        payload: { list: response, loading: false, initKey: keys },
      })
    },
    // *search({ payload }, { call, put, select }) {
    //   const statePage = yield select(state => state.exchange.page)
    //   const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
    //   const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.exchange.searchParam)
    //   console.log('搜索参数', page, searchParam)
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: true },
    //   })
    //   const response = yield call(getChildList, { searchParam, page })
    //   console.log('查询结果', response)
    // },
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
