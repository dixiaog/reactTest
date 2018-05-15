import moment from 'moment'
import { pickUpBatch, zcExport, vipExport, ljExport, djExport, ddExport } from '../services/inventory/pickBatch'
import { storeExport } from '../services/inventory/shopReple'
import { getLocalStorageItem } from '../utils/utils'

export default {
  namespace: 'createBatch',

  state: {
    list: [],
    total: 0,
    loading: false,
    operateUsers: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {
      
    },
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { batchType } = payload
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const searchParam = yield select(state => state.createBatch.searchParam)
      Object.assign(searchParam, 
        ['1','2','3','6','7'].indexOf(batchType)> -1 ? {
          maxNumber: getLocalStorageItem('maxNumber') ? getLocalStorageItem('maxNumber') : 40, 
        }:{},
        ['1','2','3','4','5','6'].indexOf(batchType)> -1 ? {
          orderTime: moment().format('YYYY-MM-DD HH:mm:ss'), 
        }:{},
      )
      const response = yield call(pickUpBatch, Object.assign(payload,searchParam))
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, searchParam },
      })
    },

    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.createBatch.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.createBatch.searchParam)
      const { batchType } = payload.searchParam
      Object.assign(searchParam, {
        jingDongToPay : searchParam.jingDongToPay && searchParam.jingDongToPay !== 'N' ? 'Y' : 'N',
        accordingToOrder : searchParam.accordingToOrder && searchParam.accordingToOrder !== 'N' ? 'Y' : 'N',
        elevatedFlag : searchParam.elevatedFlag && searchParam.elevatedFlag !== 'N' ? 'Y' : 'N',
      },['1','2','3','7','6'].indexOf(`${batchType}`)> -1 ? {
        maxNumber: getLocalStorageItem('maxNumber') ? (getLocalStorageItem('maxNumber') !== 'undefined' ? 0 : getLocalStorageItem('maxNumber')) : 40, 
      }:{},
      ['1','2','3','4','5','6'].indexOf(`${batchType}`)> -1 ? {
        orderTime: searchParam.orderTime ? moment(searchParam.orderTime).format('YYYY-MM-DD HH:mm:ss') : null, 
      }:{},
      )
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(pickUpBatch, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
      })
    },
    *export({payload}, { call, put, select }) {
      const { batchType, exportPayload } = payload
      if (batchType * 1 === 1) {
        yield call(zcExport, exportPayload)
      } else if (batchType * 1 === 6) {
        yield call(vipExport, exportPayload)
      } else if (batchType * 1 === 2) {
        yield call(ljExport, exportPayload)
      } else if (batchType * 1 === 3) {
        yield call(djExport, exportPayload)
      } else if (batchType * 1 === 4) {
        yield call(ddExport, exportPayload)
      }
    },
    *clean(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { selectedRows: [], selectedRowKeys: [] },
      })
    },
    *clear(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    // 生成门店补货 导出
    *storeExport(_, { call, put, select }) {
      const searchParam = yield select(state => state.nobill.searchParam)
        yield call(storeExport, {...searchParam, fileName: '生成门店补货.xls'})
    },
    // 生成门店补货  生成批次
  *CASFR(_, {call, select}) {
    const searchParam = yield select(state => state.nobill.searchParam)
    yield call(createMoreThanBatch, {...searchParam})
  },
 },

  reducers: {
    changeState(state, { payload }) {
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
  },
}
