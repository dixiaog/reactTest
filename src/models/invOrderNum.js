import { getOrderNum } from '../services/inventory/itemInv'

export default {
    namespace: 'orderNum',

    state: {
      list1: [],
      loading1: false,
      total1: 0,
      page: {},
      skuNo: '',
    },

    effects: {
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.orderNum.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        // const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.orderNum.searchParam)
        const skuNo1 = yield select(state => state.orderNum.skuNo)
        yield put({
          type: 'changeState',
          payload: { loading1: true },
        })
        const response = yield call(getOrderNum, { ...page, skuNo: payload.skuNo ? payload.skuNo : skuNo1 })
        yield put({
          type: 'changeState',
          payload: { list1: response.list, loading1: false, total1: response.pagination.total },
        })
      },
      *setSkuNo({ payload }, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { skuNo: payload },
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
