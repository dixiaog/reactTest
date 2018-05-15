import moment from 'moment'
import { getfundDetailList, deleteByAutoNo, updateStatusPass, updateStatusNotPass, repealStatus } from '../services/order/receivables'

export default {
    namespace: 'receivables',

    state: {
      list: [],
      total: 0,
      loading: false,
      // 下面需要的
      selectedRows: [],
      selectedRowKeys: [],
      page: {},
      searchParam: {
        billDateFirst: moment().subtract(6, 'days').format('YYYY-MM-DD'),
          billDateEnd: moment().format('YYYY-MM-DD'),
      },
    },

    effects: {
      *fetch(_, { call, put, select }) {
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        // const list = yield select(state => state.receivables.list)
        // const searchParam = yield select(state => state.receivables.searchParam)
        // if (!(list && list.length)) {
        // const searchParam = {
        //   billDateFirst: moment().subtract(6, 'days').format('YYYY-MM-DD'),
        //   billDateEnd: moment().format('YYYY-MM-DD'),
        // }
          const response = yield call(getfundDetailList, {
            billDateFirst: moment().subtract(6, 'days').format('YYYY-MM-DD'),
            billDateEnd: moment().format('YYYY-MM-DD'),
          })
          // , searchParam
          yield put({
            type: 'changeState',
            payload: { ...response, total: response.pagination.total },
          })
        // }
        yield put({
          type: 'changeState',
          payload: { loading: false, selectedRows: [], selectedRowKeys: [],
            searchParam: {
              billDateFirst: moment().subtract(6, 'days').format('YYYY-MM-DD'),
              billDateEnd: moment().format('YYYY-MM-DD'),
            },
          },
        })
      },
      *search({ payload }, { call, put, select }) {
        const statePage = yield select(state => state.receivables.page)
        const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
        const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.receivables.searchParam)
        Object.assign(searchParam, {
          billDateFirst: searchParam.billDateFirst ? moment(searchParam.billDateFirst).format('YYYY-MM-DD') : null,
          billDateEnd: searchParam.billDateEnd ? moment(searchParam.billDateEnd).format('YYYY-MM-DD') :null,
        })
        yield put({
          type: 'changeState',
          payload: { loading: true },
        })
        const response = yield call(getfundDetailList, { ...searchParam, ...page })
        yield put({
          type: 'changeState',
          payload: { ...response,total: response.pagination.total, loading: false, searchParam, page },
        })
      },
      *delete({ payload }, { call, put }) {
        const response = yield call(deleteByAutoNo, payload)
        if (response) {
          yield put({
            type: 'receivables/search',
          })
        }
      },
      *pass({ payload }, { call, put }) {
        const response = yield call(updateStatusPass, payload)
        if (response) {
          yield put({
            type: 'receivables/search',
          })
        }
      },
      *notPass({ payload }, { call, put }) {
        const response = yield call(updateStatusNotPass, payload)
        if (response) {
          yield put({
            type: 'receivables/search',
          })
        }
      },
      *repeal({ payload }, { call, put }) {
        const response = yield call(repealStatus, payload)
        if (response) {
          yield put({
            type: 'receivables/search',
          })
        }
      },
    },

    reducers: {
      changeState(state, { payload }) {
        console.log('payload', payload)
        return {
          ...state,
          ...payload,
        }
      },
    },
}
