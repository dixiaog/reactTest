import { getProductPop } from '../services/inventory/manager'

export default {
  namespace: 'productPop',

  state: {
    list: [],
    total: 0,
    loading: false,
    initKey: [],
    // 下面4个必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getProductPop, payload)
      // 保存首次获取到的数据的key，以此来判断子页面是否禁止
      const keys = []
      response.list.forEach((ele) => {
        keys.push(ele.skuNo)
      })
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, initKey: keys },
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
    clean(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    // delete(state, { payload }) {
    //   return {
    //     ...state,
    //     ...payload,
    //   }
    // },
  },
}
