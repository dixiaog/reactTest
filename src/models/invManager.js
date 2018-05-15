import moment from 'moment'
import { getPurData, getPurchaseUser, getPurDataSearch } from '../services/inventory/manager'
import { toUnPurchaseStorage } from '../services/inventory/storage'

export default {
  namespace: 'manager',

  state: {
    list: [],
    total: 0,
    loading: false,
    purUser: [],
    warehouses: [], // 仓库
    suppliers: [], // 供应商
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: { createTime: moment().subtract(7, 'days'), endTime: moment().subtract(0, 'days') },
    searchParamJ: { createTime: moment().subtract(7, 'days'), endTime: moment().subtract(0, 'days') },
    billNo: null,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const list = yield select(state => state.manager.list)
      const searchParam = yield select(state => state.manager.searchParam)
      if (!(list && list.length)) {
        const response = yield call(getPurData, searchParam)
        const responseInit = yield call(toUnPurchaseStorage)
        const purchaseUser = yield call(getPurchaseUser)
        const purUser = []
        purchaseUser.forEach((ele) => {
          purUser.push(Object.assign({ userId: ele.userId, nickName: ele.userName }))
        })
        if (response === null) {
          yield put({
            type: 'changeState',
            payload: { list: [], total: 0, warehouses: responseInit.warehouses, suppliers: responseInit.suppliers, purUser },
          })
        } else {
          yield put({
            type: 'changeState',
            payload: { ...response, total: response.pagination.total, warehouses: responseInit.warehouses, suppliers: responseInit.suppliers, purUser },
          })
        }
      }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.manager.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.manager.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getPurDataSearch, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total, selectedRows: [], selectedRowKeys: [] },
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
