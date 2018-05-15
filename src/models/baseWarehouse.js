import { getWarehouse, Enable, Save, GetViewData } from '../services/base/warehouse'

const generateList = (data, dataList) => {
  data.forEach((ele) => {
    dataList.push({ key: ele.key, title: ele.title })
    if (ele.children && ele.children.length) {
      generateList(ele.children, dataList)
    }
  })
  return dataList
}
export default {
  namespace: 'warehouse',

  state: {
    list: [],
    total: 0,
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
      // const list = yield select(state => state.warehouse.list)
      // const searchParam = yield select(state => state.warehouse.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getWarehouse)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.warehouse.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.warehouse.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getWarehouse, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page },
      })
    },
    *enable({ payload }, { call, put }) {
      const response = yield call(Enable, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'fetch',
      })
    },
    *save({ payload }, { call, put }) {
      const response = yield call(Save, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
      })
      yield put({
        type: 'fetch',
      })
    },
    *getViewData({ payload }, { call, put }) {
      const response = yield call(GetViewData, { ...payload })
      yield put({
        type: 'changeState',
        payload: response,
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
