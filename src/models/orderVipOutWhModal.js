import { getVipOutWhDetail } from '../services/order/vipOutWh'

export default {
    namespace: 'vipOutWhModal',

    state: {
      list: [],
      total: 0,
      chooseRows: [],
      loading: false,
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
    },

    effects: {
      *fetch({ payload }, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getVipOutWhDetail, payload)
        if (response !== null) {
          yield put({
            type: 'changeState',
            payload: { list: response.list, total: response.pagination.total },
          })
        }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [] },
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
      shopName(state, { payload }) {
        return {
          ...state,
          lists: payload,
        }
      },
    },
}
