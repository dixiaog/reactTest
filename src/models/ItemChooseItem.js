import { getChooseItem } from '../services/capacity'

export default {
    namespace: 'chooseItem',

    state: {
      list: [],
      total: 0,
      loading: false,
      searchBarProps: {},
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {},
      searchParamT: false,
      searchParamGift: false,
      searchParamComb: false, 
    },

    effects: {
      *reset({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getChooseItem, { ...payload })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
        })
      },
      *fetch({ payload }, { call, put }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getChooseItem, { ...payload })
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, total: response.pagination.total, list: response.list, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.chooseItem.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.chooseItem.searchParam)
        const Enable = yield select(state => state.chooseItem.searchParamT)
        const searchParamGift = yield select(state => state.chooseItem.searchParamGift)
        const searchParamComb = yield select(state => state.chooseItem.searchParamComb)
        if (Enable) {
          Object.assign(searchParam, { enableStatus: '1' })
        }
        if (searchParamGift) {
          Object.assign(searchParam, { productType: '0' })
        }
        if (searchParamComb) {
          Object.assign(searchParam, { productType: '1' })
        }
        Object.assign(searchParam, { comboNo: searchParam.productNo ? searchParam.productNo.trim() : undefined,
          skuNo: searchParam.skuNo ? searchParam.skuNo.trim() : undefined,
          skus: searchParam.skus ? searchParam.skus.trim() : undefined,
          productName: searchParam.productName ? searchParam.productName.trim() : undefined,
        })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getChooseItem, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { list: response.list, total: response.pagination.total, loading: false, searchParam, page, selectedRows: [], selectedRowKeys: [] },
        })
      },
      *clean(_, { put }) {
        yield put({
          type: 'changeState',
          payload: { selectedRows: [], selectedRowKeys: [], isRadio: false, searchParam: {}, page: {} },
        })
      },
      *saveKeys({ payload }, { put }) {
        yield put({
          type: 'save',
          payload: { selectedRowKeys: payload, selectedRows: payload },
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

      save(state, payload) {
        return {
          ...state,
          selectedRowKeys: payload.payload.selectedRowKeys,
        }
      },

      deleteChoose(state, payload) {
        return {
          ...state,
          selectedRowKeys: payload.payload.selectedRowKeys,
        }
      },
    },
}
