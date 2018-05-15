import { getStoDataList, toUnPurchaseStorage, getDetail } from '../services/inventory/storage'
import { getPurchaseUser } from '../services/inventory/manager'

export default {
  namespace: 'storage',

  state: {
    list: [],
    total: 0,
    loading: false,
    warehouses: [], // 仓库
    suppliers: [], // 供应商
    billNo: '', // 记录billNo
    purNo: '', // 记录采购管理单号
    purUser: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    disabled: false,
    delicacy: false,
    diffSkuNo: -1,
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const list = yield select(state => state.storage.list)
      const searchParam = yield select(state => state.storage.searchParam)
      if (!(list && list.length)) {
        const response = yield call(getStoDataList, { ...searchParam, diffSkuNo: -1 })
        const responseInit = yield call(toUnPurchaseStorage)
        const responseGetDetail = yield call(getDetail, { paramNo: 'WMS_DELICACY_MAN' })
        const purchaseUser = yield call(getPurchaseUser)
        const purUser = []
        purchaseUser.forEach((ele) => {
          purUser.push(Object.assign({ userId: ele.userId, nickName: ele.userName }))
        })
        let delicacy = false
        if (responseGetDetail.paramValue === '1') {
          delicacy = true
        }
        yield put({
          type: 'changeState',
          payload: {
            ...response,
            total: response.pagination.total,
            warehouses: responseInit ? responseInit.warehouses : [],
            suppliers: responseInit ? responseInit.suppliers : [],
            delicacy, purUser },
        })
      }
      yield put({
        type: 'changeState',
        payload: {
          loading: false,
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.storage.page)
      const diffSkuNo = yield select(state => state.storage.diffSkuNo)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.storage.searchParam)
      Object.assign(searchParam, { diffSkuNo })
      if (searchParam.startTime) {
        Object.assign(searchParam, { startTime: searchParam.startTime.format('YYYY-MM-DD') })
      }
      if (searchParam.endTime) {
        Object.assign(searchParam, { endTime: searchParam.endTime.format('YYYY-MM-DD') })
      }
      if (!searchParam.startTime && !searchParam.endTime) {
        yield put({
          type: 'changeState',
          payload: { disabled: true },
        })
      }
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getStoDataList, { ...searchParam, ...page })
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
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveT(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
