/*
 * @Author: Wupeng
 * @Date: 2018-04-25 14:17:49 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-04-25 15:05:48
 * 生成门店补货 
 */
import { pickUpBatch, storeExport } from '../services/inventory/shopReple'

export default {
    namespace: 'shopreple',

    state: {
        list: [],
        total: 0,
        loading: false,
        operateUsers: [],
        // 下面4个必选
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
          const searchParam = yield select(state => state.shopreple.searchParam)
          const response = yield call(pickUpBatch, searchParam)
          yield put({
            type: 'changeState',
            payload: { loading: false, total: response.pagination.total, ...response, searchParam: {
                // locationType: 3,
            } },
          })
        },
    
        *search({ payload }, { call, put, select }) {
          const page = payload && payload.page ?  payload.page : yield select(state => state.shopreple.page)
          const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.shopreple.searchParam)
    
          yield put({
            type: 'changeState',
            payload: { loading: true },
          })
          const response = yield call(pickUpBatch, { ...searchParam, ...page })
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, searchParam, page, total: response.pagination.total },
          })
        },
        *export(_, { call, put, select }) {
          const searchParam = yield select(state => state.shopreple.searchParam)
            yield call(storeExport, {...searchParam, fileName: '生成门店补货.xls'})
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
    