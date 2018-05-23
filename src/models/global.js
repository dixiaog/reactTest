
export default {
  namespace: 'global',

  state: {
    tabList: [{
      key: '/',
      title: '首页', 
      url: '/',
      closable: false,
    }], // 记录选取的菜单
    menu: [{ // 存放所有一级菜单
      key: '/',
      tab: '首页',
      url: '/',
    }, {
      key: '/user',
      tab: '用户列表',
      url: '/base/user',
    }, {
      key: '/shop',
      tab: '店铺管理',
      url: '/base/shop',
    }, {
      key: '/role',
      tab: '角色列表',
      url: '/sys/role',
    }],
    TabList: [{
      text: '首页',
      children: [{
        key: '/',
        tab: '首页',
        url: '/',
      }],
    }, {
      text: '系统设置',
      children: [{
        key: '/role',
        tab: '角色列表',
        url: '/sys/role',
      }],
    }, {
      text: '基础信息',
      children: [{
        key: '/user',
        tab: '用户列表',
        url: '/base/user',
      }, {
        key: '/shop',
        tab: '店铺管理',
        url: '/base/shop',
      }],
    }],
    title: '首页',
    // refresh: false,
    current: '/', // 下拉菜单当前选中
    activeKey: '/', // 激活的按钮
  },

  effects: {
    *fetch() {
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
