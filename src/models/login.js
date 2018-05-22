import { fakeAccountLogin } from '../services/login'
import router from 'umi/router'

export default {
  namespace: 'login',

  state: {
    toIndex: false,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload)
      console.log('response', response)
      if (response && response.token) {
        yield put({
          type: 'changeState',
          payload: { toIndex: true },
        })
        window.localStorage.setItem('userName', response.userName)
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('companyName', response.companyName)
        window.localStorage.setItem('tabList', JSON.stringify([{
          key: '1',
          title: '首页', 
          url: '/',
          closable: false,
        }]))
        router.push('/')
      }
      // yield put({
      //   type: 'changeState',
      //   payload: { userName: response.userDTO.userName },
      // })
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
