import { getRefundReason } from '../services/aftersale/afterSearch'
import { getAfterSkus } from '../services/aftersale/scanning'

export default {
  namespace: 'scanning',

  state: {
    list: [],
    lists: [],
    total: 0,
    chooseRows: [],
    loading: false,
    searchBarProps: {},
    selectedRows: [],
    selectedRowKeys: [],
    page: { pageSize: 50, current: 1 },
    searchParam: {},
    loading1: false,
    analyse: [],
    total1: 0,
    distributor: [],
    data: {},
    refundReasonList: [], // 退款原因
  },

  effects: {
    *getReason(_, { call, put }) {
      const refundReasonList = yield call(getRefundReason, { dictType: 4 })
      yield put({
        type: 'changeState',
        payload: { refundReasonList },
      })
    },
    *fetch({ values }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getAfterSkus, { ...values })
      yield put({
        type: 'changeState',
        payload: { list: response, loading: false, selectedRows: [], selectedRowKeys: [] },
      })
      yield put({
        type: 'changeState',
        payload: { loading: false },
      })
    },
    *clean(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      yield put({
        type: 'changeState',
        payload: {
          list: [],
          total: 0,
          loading: false,
          searchBarProps: {},
          selectedRows: [],
          selectedRowKeys: [],
          searchParam: {},
          data: {},
        },
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
    detail(state, { payload }) {
      return {
        ...state,
        data: payload,
      }
    },
  },
}
