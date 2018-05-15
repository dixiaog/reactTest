import { getLocalStorageItem } from '../utils/utils'

export default {
  namespace: 'user',

  state: {
    list: [],
    loading: false,
    currentUser: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = JSON.parse(getLocalStorageItem('user'))
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      })
    },
  },

  reducers: {
    save(state, action) {
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
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload,
      }
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload,
        },
      }
    },
  },
}
