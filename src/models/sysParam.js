import { getParamList } from '../services/sym/param'

export default {
  namespace: 'param',

  state: {
    data: [],
    loading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getParamList)
      yield put({
        type: 'changeState',
        payload: { data: response, loading: false },
      })
    //   yield put({
    //     type: 'changeState',
    //     payload: { loading: false },
    //   })
    },
    // *delete({ payload }, { call, put }) {
    //   const response = yield call(delPower, payload)
    //   if (response) {
    //     yield put({
    //       type: 'search',
    //     })
    //   }
    // },
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
