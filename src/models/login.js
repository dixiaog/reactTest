import { fakeAccountLogin } from '../services/sym/login'
import router from 'umi/router'

export default {
  namespace: 'login',

  state: {
    status: undefined,
    token: '',
    userDTO: {},
    submitting: false,
  },

  effects: {
    *accountSubmit({ payload }, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { submitting: true },
      })
      const response = yield call(fakeAccountLogin, payload)
      try {
        const status = response.userDTO.userNo ? true : false
        yield put({
          type: 'changeState',
          payload: { ...response, status, submitting: false },
        })
      } catch (err) {
        yield put({
          type: 'changeState',
          payload: { submitting: false },
        })
      }
    },
    // *mobileSubmit(_, { call, put }) {
    //   yield put({
    //     type: 'changeSubmitting',
    //     payload: true,
    //   })
    //   const response = yield call(fakeMobileLogin)
    //   yield put({
    //     type: 'changeLoginStatus',
    //     payload: response,
    //   })
    //   yield put({
    //     type: 'changeSubmitting',
    //     payload: false,
    //   })
    // },
    *logout(_, { put }) {
      yield put({
        type: 'changeState',
        payload: {
          status: false,
        },
      })
      window.localStorage.clear()
      window.location.reload()
      router.replace('/user/login')
      // window.location.href = window.location.hash
      // yield put(routerRedux.push('/user/login'))
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
