import { selectCategoryByNameOrNo, getChildrenParallelCategory, getRootDirectoryByUser } from '../services/category/category'

export default {
  namespace: 'category',

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
    treeData: [],
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      // const list = yield select(state => state.category.list)
      // const searchParam = yield select(state => state.category.searchParam)
      // if (!(list && list.length)) {
        const response = yield call(selectCategoryByNameOrNo)
        // , searchParam
        yield put({
          type: 'changeState',
          payload: { ...response, total: response.pagination.total, list: response.list },
        })
      // }
      yield put({
        type: 'changeState',
        payload: { loading: false, selectedRows: [], selectedRowKeys: [], searchParam: {} },
      })
    },
    *treead(_, { call, put }) {
      const response = yield call(getRootDirectoryByUser, {})
      if (response === null) {
        yield put({
          type: 'changeState',
          payload: {
            treeData: [
              { title: '根目录', key: '0', isLeaf: true },
            ],
          },
        })
      } else {
        for (let i = 0; i < response.list.length; i++) {
          response.list[i].title = response.list[i].categoryName
          response.list[i].key = response.list[i].categoryNo
        }
        const treeDatas = [
          { title: '根目录', key: '0', children: response.list },
        ]
        yield put({
          type: 'changeState',
          payload: {
            treeData: treeDatas,
          },
        })
      }
    },
    *fetchss(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getRootDirectoryByUser)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    *entdsh({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(selectCategoryByNameOrNo, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },
    *catesomger({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(getChildrenParallelCategory, payload)
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, total: response.pagination.total, list: response.list },
      })
    },

    *search({ payload }, { call, put, select }) {
      const page = payload && payload.page ? payload.page : yield select(state => state.category.page)
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.category.searchParam)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      if (searchParam.categoryNameOrNo === '') {
        delete searchParam.categoryNameOrNo
      }
      const response = yield call(selectCategoryByNameOrNo, { ...searchParam, ...page })
      if (payload === undefined) {
        yield put({
          type: 'changeState',
          payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page },
        })
      } else {
        if (payload.delect === 1) {
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, total: response.pagination.total, selectedRows: [], list: response.list, searchParam, page },
          })
        } else {
          yield put({
            type: 'changeState',
            payload: { ...response, loading: false, total: response.pagination.total, list: response.list, searchParam, page },
          })
        }
      }
    },
  },
  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
      }
    },
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}
