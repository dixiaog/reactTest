import { zbGetBdStorageLocation, zbExportDB } from '../services/inventory/lowerFrame'

export default {
    namespace: 'reparir',

    state: {
        list: [],
        total: 0,
        loading: false,
        operateUsers: [],
        // 下面4个必选
        selectedRows: [],
        selectedRowKeys: [],
        page: {},
        searchParam: {
            locationType: 2,
        },
      },
    
      effects: {
        *fetch(_, { call, put, select }) {
          yield put({
            type: 'changeState',
            payload: { loading: true },
          })
          const searchParam = Object.assign({
            locationType: 2,
          })
          const response = yield call(zbGetBdStorageLocation, searchParam)
          yield put({
            type: 'changeState',
            payload: { loading: false, total: response.pagination.total, ...response, searchParam: {
                locationType: 2,
            } },
          })
        },
        *paramNome({ payload }, { put, select }) {
          const searchParam = yield select(state => state.reparir.searchParam)
          Object.assign(searchParam, payload)
          yield put({
            type: 'changeState',
            payload: { searchParam: {
              ...searchParam,
            } },
          })
        },
        *search({ payload }, { call, put, select }) {
          const page = payload && payload.page ?  payload.page : yield select(state => state.reparir.page)
          const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.reparir.searchParam)
          if (searchParam.locationType === undefined) {
              Object.assign(searchParam,{
                  locationType: 2,
              })
          }
          yield put({
            type: 'changeState',
            payload: { loading: true },
          })
          const response = yield call(zbGetBdStorageLocation, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
          })
        },
        *export(_, { call, put, select }) {
          const searchParam = yield select(state => state.reparir.searchParam)
            yield call(zbExportDB, {...searchParam, fileName: '生成整补任务.xls'})
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
      },
    }
    