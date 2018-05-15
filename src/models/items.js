import { getItems, getAllBrand, enableStatus, deleteRows, inventorySync, exportSkuItem, getSkuDataByPNo } from '../services/item/items'

export default {
  namespace: 'items',

  state: {
    list: [],
    loading: false,
    brands: [],
    searchBarProps: {},
    total: 0,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    lists: [],
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.items.list)
      // const searchParam = yield select(state => state.items.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(getItems)
        // , searchParam
        const brands = yield call(getAllBrand)
        yield put({
          type: 'changeState',
          payload: { ...response, brands, total: response.pagination.total },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.items.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.items.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getItems, { ...searchParam, ...page })
      yield put({
        type: 'changeState',
        payload: { ...response,
          loading: false,
          searchParam,
          page,
          total: response.pagination.total,
          selectedRows: [],
          selectedRowKeys: [],
         },
      })
    },
    *enable({ payload }, { call, put }) {
      yield call(enableStatus, payload)
      yield put({
        type: 'items/search',
      })
    },
    *deleteRows({ payload }, { call, put }) {
      yield call(deleteRows, payload)
      yield put({
        type: 'items/search',
      })
    },
    *sync({ payload }, { call, put }) {
      yield call(inventorySync, payload)
      yield put({
        type: 'items/search',
      })
    },
    *exportSku({ payload }, { call }) {
      yield call(exportSkuItem, payload)
    },
    *clear(_, { put }) {
      yield put({
        type: 'changeState',
        payload: { lists: [] },
      })
    },
    *getSkuDataByPNo({ payload }, { call, put }) {
      const response = yield call(getSkuDataByPNo, payload)
      const array = []
      yield put({
        type: 'getList',
        payload: { list: response, ids: array },
      })
    },
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    },
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    getList(state, { payload }) {
      return {
        ...state,
        lists: payload.list,
        ids: payload.ids,
      }
    },
  },
}
