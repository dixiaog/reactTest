import { getAfterList, getRefundReason } from '../services/aftersale/afterSearch'
import { toUnPurchaseStorage } from '../services/inventory/storage'
import { getShop } from '../services/order/search'

export default {
  namespace: 'afterSearch',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    searchParam: {},
    page: {},
    disabled: false,
    warehouseList: [], // 仓库列表
    refundReasonList: [], // 退款原因
    shopList: [], // 店铺
    defaultActiveKey: [],
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.afterSearch.list)
      const searchParam = yield select(state => state.afterSearch.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getAfterList, searchParam)
        // , searchParam
        const warehouseList = yield call(toUnPurchaseStorage)
        const refundReasonList = yield call(getRefundReason, { dictType: 4 })
        const shopList = yield call(getShop, {})
        yield put({
          type: 'changeState',
          payload: {
            shopList,
            refundReasonList,
            warehouseList: warehouseList.warehouses,
            disabled: true,
            list: response.list,
            total: response.pagination.total,
          },
        })
      // }
      yield put({
        type: 'changeState',
        payload: {
          loading: false,
          selectedRows: [],
          selectedRowKeys: [],
          searchParam: {},
        },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.afterSearch.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.afterSearch.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getAfterList, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { disabled: true, list: response.list, total: response.pagination.total, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
      })
      // yield put({
      //   type: 'changeState',
      //   payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      // })
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
