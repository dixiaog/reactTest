import moment from 'moment'
import { message } from 'antd'
import { getShopProduct, getShopName, exportRepeatShopSku, exportNoDistributionShopSku, exportShopSku } from '../services/item/shopProduct'

export default {
    namespace: 'shopProduct',

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
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.shopProduct.list)
        // const searchParam = yield select(state => state.shopProduct.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getShopProduct)
          // , searchParam
          if (response !== null) {
            yield put({
              type: 'changeState',
              payload: { list: response.list, total: response.pagination.total },
            })
          }
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.shopProduct.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.shopProduct.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const start = searchParam.startLastSyncTime === undefined || searchParam.startLastSyncTime === null ? undefined : new Date(searchParam.startLastSyncTime).toLocaleDateString()
        const end = searchParam.endLastSyncTime === undefined || searchParam.endLastSyncTime === null ? undefined : new Date(searchParam.endLastSyncTime).toLocaleDateString()
        Object.assign(searchParam, { startLastSyncTime: start, endLastSyncTime: end })
        if (searchParam.lowestLockInventory && searchParam.highestLockInventory && searchParam.lowestLockInventory > searchParam.highestLockInventory) {
          message.error('最高库存必须大于等于最低库存')
          yield put({
            type: 'changeState',
            payload: { loading: false },
          })
        } else {
          const response = yield call(getShopProduct, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
          })
        }
      },
      *getShopName(_, { call, put }) {
        const response = yield call(getShopName)
        yield put({
          type: 'shopName',
          payload: response,
        })
      },
      *exportRepeatShopSku({ payload }, { call }) {
        yield call(exportRepeatShopSku, payload)
      },
      *exportNoDistributionShopSku({ payload }, { call }) {
        yield call(exportNoDistributionShopSku, payload)
      },
      *exportShopSku({ payload }, { call }) {
        Object.assign(payload.searchParam,
          {
            startLastSyncTime: payload.searchParam.startLastSyncTime ? moment(payload.searchParam.startLastSyncTime).format('YYYY-MM-DD') : undefined,
            endLastSyncTime: payload.searchParam.endLastSyncTime ? moment(payload.searchParam.endLastSyncTime).format('YYYY-MM-DD') : undefined })
        yield call(exportShopSku, payload)
      },
    },

    reducers: {
      changeState(state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },
      shopName(state, { payload }) {
        return {
          ...state,
          lists: payload,
        }
      },
    },
}
