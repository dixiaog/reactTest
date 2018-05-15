import { getOut } from '../services/order/vipOutWh'

export default {
    namespace: 'chooseOut',

    state: {
      list: [],
      total: 0,
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
        const response = yield call(getOut, payload)
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
      *clear(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [] },
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
