/*
 * @Author: Wupeng
 * @Date: 2018-04-25 14:16:13 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 15:05:02
 * 生成移货下架
 */
import { getBatchSummary, yhExportDB } from '../services/inventory/lowerFrame'

export default {
    namespace: 'lower',

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
            locationType: 3,
        },
      },
    
      effects: {
        *fetch(_, { call, put, select }) {
          yield put({
            type: 'changeState',
            payload: { loading: true },
          })
          const searchParam = Object.assign({
            locationType: 3,
          })
          const response = yield call(getBatchSummary, searchParam)
          yield put({
            type: 'changeState',
            payload: { loading: false, total: response.pagination.total, ...response, searchParam: {
                locationType: 3,
            } },
          })
        },
        *paramNome({ payload }, { put, select }) {
          const searchParam = yield select(state => state.lower.searchParam)
          Object.assign(searchParam, payload)
          yield put({
            type: 'changeState',
            payload: { searchParam: {
              ...searchParam,
            } },
          })
        },
        *search({ payload }, { call, put, select }) {
          const page = payload && payload.page ?  payload.page : yield select(state => state.lower.page)
          const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.lower.searchParam)
          if (searchParam.locationType === undefined) {
            Object.assign(searchParam,{
                locationType: 3,
            })
        }
          yield put({
            type: 'changeState',
            payload: { loading: true },
          })
          const response = yield call(getBatchSummary, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
          })
        },
        *export(_, { call, put, select }) {
          const searchParam = yield select(state => state.lower.searchParam)
            yield call(yhExportDB, {...searchParam, fileName: '生成移货下架.xls'})
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
    