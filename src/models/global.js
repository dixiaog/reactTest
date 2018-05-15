import { queryNotices } from '../services/api'
import { menusRestruct, menusReview } from '../utils/utils'
import { getMenus } from '../services/sym/menus'

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    isMinSize: document.body.clientWidth < 769,
    notices: [],
    fetchingNotices: false,
    menus: [],
    tabList: [{
      key: 'analysis',
      path: '/dashboard/analysis',
      tab: '首页',
      default: true,
    }],
  },

  effects: {
    *fetchNotices(_, { call, put }) {
      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      })
      const data = yield call(queryNotices)
      yield put({
        type: 'saveNotices',
        payload: data,
      })
    },
    *clearNotices({ payload }, { put, select }) {
      const count = yield select(state => state.global.notices.length)
      yield put({
        type: 'user/changeNotifyCount',
        payload: count,
      })

      yield put({
        type: 'saveClearedNotices',
        payload,
      })
    },
    *getMenus(_, { call, put }) {
      const response = yield call(getMenus)
      if (response !== null) {
        const menus = menusRestruct(response)
        const newMenus = menusReview(menus)
        console.log('menus', menus, 'newMenus', newMenus)
        yield put({
          type: 'showMenus',
          payload: newMenus.filter(e => typeof e === 'object' && e.children && e.children.length > 0),
        })
      } else {
        yield put({
          type: 'showMenus',
          payload: [],
        })
      }
    },
  },

  reducers: {
    changeTabList(state, { payload }) {
      return {
        ...state,
        tabList: payload,
      }
    },
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
        isMinSize: document.body.clientWidth < 769,
      }
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      }
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      }
    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      }
    },
    showMenus(state, { payload }) {
      return {
        ...state,
        // menus: payload,
        menus: [{
          name: '仪表盘',
          path: 'dashboard',
          icon: 'dashboard',
          children: [{
            name: '首页',
            path: 'analysis',
            icon: 'book',
          }],
        }, {
          name: '系统',
          path: 'system',
          icon: 'desktop',
          children: [{
            name: '用户管理',
            path: 'users',
            icon: 'user',
          }],
        }]
      }
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search)
        }
      })
    },
  },
}
