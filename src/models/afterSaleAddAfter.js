import moment from 'moment'
import { selectOrderList, getRefundReason } from '../services/aftersale/afterSearch'
import { getOrderDetail, getShop } from '../services/order/search'
import { toUnPurchaseStorage } from '../services/inventory/storage'
import { getExpresscorp } from '../services/base/express'

export default {
  namespace: 'addAfter',
  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    searchParam: { beginTime: moment().subtract(0, 'days').format('YYYY-MM-DD'), endTime: moment().subtract(-7, 'days').format('YYYY-MM-DD') },
    page: {},
    disabled: false,
    current: 1,
    pageSize: 20,
    orderNo: null, // 点击的行的唯一orderNo
    expand: false,
    warehouseList: [], // 仓库列表
    refundReasonList: [], // 退款原因
    shopList: [], // 店铺
    suppliers: [], // 分销商
    expressList: [], // 快递公司
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const lists = yield select(state => state.addAfter.list)
      // const searchParam = yield select(state => state.addAfter.searchParam)
      // if (!(lists && lists.length)) {
        const response = yield call(selectOrderList, { beginTime: moment().subtract(0, 'days').format('YYYY-MM-DD'), endTime: moment().subtract(-7, 'days').format('YYYY-MM-DD') })
        // , searchParam
        const warehouse = yield call(toUnPurchaseStorage)
        const refundReasonList = yield call(getRefundReason, { dictType: 4 })
        const shopList = yield call(getShop, {})
        const expressList = yield call(getExpresscorp)
        // 为每一个数据加个loading
        const list = response.list
        list.forEach((ele) => {
          Object.assign(ele, { loading: false })
        })
        yield put({
          type: 'changeState',
          payload: {
            expressList: expressList.list,
            shopList, refundReasonList,
            suppliers: warehouse.suppliers,
            warehouseList: warehouse.warehouses,
            list,
            total: response.pagination.total,
            },
        })
      // }
      yield put({
        type: 'changeState',
        payload: {
          loading: false, selectedRows: [], selectedRowKeys: [],
          searchParam: { beginTime: moment().subtract(0, 'days').format('YYYY-MM-DD'), endTime: moment().subtract(-7, 'days').format('YYYY-MM-DD') },
        },
      })
    },
    *search({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { expand: true },
      })
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.addAfter.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectOrderList, { ...searchParam })
      // 为每一个数据加个loading
      const list = response.list
      list.forEach((ele) => {
        Object.assign(ele, { loading: false })
      })
      yield put({
        type: 'changeState',
        payload: { list, total: response.pagination.total, loading: false, searchParam },
      })
    },
    *getChild({ payload }, { call, put, select }) {
      const list = yield select(state => state.addAfter.list)
      const orderNo = yield select(state => state.addAfter.orderNo)

      // 获取数据之前显示loading效果
      for (const index in list) {
        if (list[index].orderNo === orderNo) {
          Object.assign(list[index], { loading: true })
        }
      }
      yield put({
        type: 'changeState',
        payload: { list },
      })
      const response = yield call(getOrderDetail, payload)
      for (const index in list) {
        if (list[index].orderNo === orderNo) {
          Object.assign(list[index], { child: response.list, loading: false })
        }
      }
      yield put({
        type: 'changeState',
        payload: { list },
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
