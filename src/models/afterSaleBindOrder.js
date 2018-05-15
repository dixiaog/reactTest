import moment from 'moment'
import { selectOrderList, selectAfterList } from '../services/aftersale/afterSearch'
import { getShop, getOrderDetail } from '../services/order/search'
import { toUnPurchaseStorage } from '../services/inventory/storage'
import { getExpresscorp } from '../services/base/express'

export default {
  namespace: 'bindOrder',

  state: {
    list: [],
    total: 0,
    loading: false,
    selectedRows: [],
    selectedRowKeys: [],
    searchParam: { beginTime: moment().subtract(0, 'days'), endTime: moment().subtract(-7, 'days') },
    disabled: false,
    page: {},
    current: 1,
    pageSize: 20,
    refundId: null, // 点击的行的唯一refundId
    expand: false,
    warehouseList: [], // 仓库列表
    shopList: [], // 店铺
    suppliers: [], // 分销商
    expressList: [], // 快递公司
    orderNo: '',
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectAfterList, payload)
      const warehouse = yield call(toUnPurchaseStorage)
      const shopList = yield call(getShop)
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
          shopList, suppliers: warehouse.suppliers,
          warehouseList: warehouse.warehouses,
          list, total: response.pagination.total,
          loading: false,
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
    },
    *search({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { expand: true },
      })
      const current = yield select(state => state.bindOrder.current)
      const pageSize = yield select(state => state.bindOrder.pageSize)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.bindOrder.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectOrderList, { ...searchParam, current, pageSize })
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
      const list = yield select(state => state.bindOrder.list)
      const orderNo = yield select(state => state.bindOrder.orderNo)

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
