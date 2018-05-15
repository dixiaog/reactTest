import { getItemInv, exportItem, beyond, low, getOrderNum } from '../services/inventory/itemInv'

export default {
    namespace: 'itemInv',

    state: {
      list: [],
      lists: [],
      total: 0,
      chooseRows: [],
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: { status: '1' },
      distributor: [],
      list1: [],
      loading1: false,
      total1: 0,
      page1: {},
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.itemInv.list)
        // const searchParam = yield select(state => state.itemInv.searchParam)
        // if (!(list && list.length)) {
          const response = yield call(getItemInv, { status: '1' })
          // , searchParam
          yield put({
            type: 'changeState',
            payload: { ...response, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: { status: '1' } },
        })
      },
      *beyond(_, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(beyond)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [] },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *low(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(low)
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, selectedRows: [], selectedRowKeys: [] },
        })
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.itemInv.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.itemInv.searchParam)
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        Object.assign(searchParam, { productNo: searchParam.productNo ? searchParam.productNo.trim() : undefined,
          skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined,
          productName: searchParam.productName ? searchParam.productName.trim() : undefined,
          productSpec: searchParam.productSpec ? searchParam.productSpec.trim() : undefined,
        })
        const response = yield call(getItemInv, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *exportItem({ payload }, { call }) {
        yield call(exportItem, payload)
        // yield put({
        //   type: 'items/search',
        // })
      },
      // *getOrderNum({ payload }, { call }) {
      //   yield put({
      //     type: 'changeState',
      //     payload: { loading1: true },
      //   })
      //   yield call(getOrderNum, payload)
      //   yield put({
      //     type: 'changeState',
      //     payload: { list1: response.list, loading1: false, total1: response.pagination.total, page1: response.page },
      //   })
      // },
      *getOrderNum({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.goodModal.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        yield put({
          type: 'changeState',
          payload: { loading1: true },
        })
        const response = yield call(getOrderNum, { webOmOrderDTO: { ...page }, skuNo: payload.skuNo })
        yield put({
          type: 'changeState',
          payload: { list1: response.list, loading1: false, total1: response.pagination.total, page1: page },
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
