
export default {
  namespace: 'global',

  state: {
    panes: [{
      key: '/',
      title: '首页', 
      url: '/',
      closable: false,
    }], // 记录选取的菜单
    tabList: [{ // 存放所有一级菜单
      key: '/',
      tab: '首页',
      url: '/',
    }, {
      key: '/user',
      tab: '用户列表',
      url: '/base/user',
    }, {
      key: '/dictionary',
      tab: '数据字典',
      url: '/base/dictionary',
    }, {
      key: '/wechat',
      tab: '微信用户',
      url: '/base/wechat',
    }, {
      key: '/shop',
      tab: '店铺管理',
      url: '/base/shop',
    }, {
      key: '/category',
      tab: '商品类目',
      url: '/base/category',
    }, {
      key: '/software',
      tab: '软件列表',
      url: '/base/software',
    },{
      key: '/role',
      tab: '角色列表',
      url: '/sys/role',
    }, {
      key: '/power',
      tab: '权限管理',
      url: '/sys/power',
    }, {
      key: '/menu',
      tab: '菜单管理',
      url: '/sys/menu',
    }, {
      key: '/task',
      tab: '任务管理',
      url: '/sys/task',
    }],
    TabList: [{
      text: '基础信息',
      children: [{
        key: '/',
        tab: '首页',
        url: '/',
      }, {
        key: '/user',
        tab: '用户列表',
        url: '/base/user',
      }, {
        key: '/dictionary',
        tab: '数据字典',
        url: '/base/dictionary',
      }, {
        key: '/wechat',
        tab: '微信用户',
        url: '/base/wechat',
      }, {
        key: '/shop',
        tab: '店铺管理',
        url: '/base/shop',
      }, {
        key: '/category',
        tab: '商品类目',
        url: '/base/category',
      }, {
        key: '/software',
        tab: '软件列表',
        url: '/base/software',
      }],
    },{
      text: '系统设置',
      children: [{
        key: '/role',
        tab: '角色列表',
        url: '/sys/role',
      }, {
        key: '/power',
        tab: '权限管理',
        url: '/sys/power',
      }, {
        key: '/menu',
        tab: '菜单管理',
        url: '/sys/menu',
      }, {
        key: '/task',
        tab: '任务管理',
        url: '/sys/task',
      }],
    }],
    title: '首页',
    refresh: false,
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
