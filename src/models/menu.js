// import { getUserList } from '../services/base'

export default {
  namespace: 'menu',

  state: {
    list: [],
    loading: false,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: {
          list: [{
            sortIndex: '1',
            text: '基础信息',
            children: [{
              sortIndex: '2', text: "用户列表", href: "/userConfig/userList", iconFont: "f-icon-users"
            }, {
              sortIndex: '3', text: "数据字典", href: "/dicConfig/dicList", iconFont: "f-icon-book"
            }, {
              sortIndex: '5', text: "店铺管理", href: "/app/shop/shopList", iconFont: "f-icon-shopping-cart"
            }, {
              sortIndex: '6', text: "商品类目", href: "/app/item/itemList", iconFont: "f-icon-cubes"
            }, {
              sortIndex: '7', text: "软件列表", href: "/app/app/appList", iconFont: "f-icon-android"
            }],
          }],
        },
      })
      // yield put({
      //   type: 'changeState',
      //   payload: { loading: true },
      // })
      // const {data} = yield call(getMenuList)
      // yield put({
      //   type: 'changeState',
      //   payload: { ...data, loading: false },
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
