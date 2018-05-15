import { selStoragelocation, selStoragelocationGroupByAreaNo, selStoragelocationBylocationNo } from '../services/position/position'

export default {
  namespace: 'position',

  state: {
    list: [],
    treeData: [],
    loading: false,
    brands: [],
    searchBarProps: {},
    total: 0,
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
    warehouseNo: null,
    locationNo: null,
    locationType: null,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
        },
      })
      const response = yield call(selStoragelocation, payload)
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          warehouseNo: payload.warehouseNo,
          locationType: payload.locationType,
          locationNo: null,
          page: [],
          selectedRowKeys: [],
          searchParam: {},
        },
      })
    },
    *treead({ payload }, { call, put }) {
      const response = yield call(selStoragelocationGroupByAreaNo, payload)
      const data = (response === null) ? [] : response
      for (let i = 0; i < data.length; i++) {
          data[i].title = `区域${data[i].areaNo}`
          data[i].key = data[i].autoNo
        }
      yield put({
        type: 'changeState',
        payload: {
          treeData: data,
        },
      })
    },
    *endtch({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
        warehouseNo: payload.warehouseNo,
        locationType: payload.locationType,
      })
      const response = yield call(selStoragelocationBylocationNo, { ...payload })
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          page: [],
          selectedRows: [],
          selectedRowKeys: [],
          searchParam: { locationNo: payload.locationNo },
        },
      })
    },

    *search({ payload }, { call, put, select }) {
      const warehouseNo = yield select(state => state.position.warehouseNo)
      const locationType = yield select(state => state.position.locationType)
      const page = payload && payload.page ? payload.page : yield select(state => state.position.page)
      const locationNo = yield select(state => state.position.searchParam)
      yield put({
        type: 'changeState',
        payload: {
          loading: true,
        },
      })
      const response = yield call(selStoragelocationBylocationNo, { ...page, warehouseNo, locationType, ...locationNo })
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          page,
          selectedRows: [],
          selectedRowKeys: [],
        },
      })
    },
    *searchs({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selStoragelocationBylocationNo, { ...payload })
      yield put({
        type: 'changeState',
        payload: {
          ...response,
          loading: false,
          total: response.pagination.total,
          list: response.list,
          page: [],
          selectedRows: [],
          selectedRowKeys: [],
          searchParam: { locationNo: payload.locationNo },
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
  },
}
