/*
 * @Author: jiangteng
 * @Date: 2017-12-24 20:52:36
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-04-27 13:23:18
 */

import { getRoles, getMenu, getPermission } from '../services/system'

export default {
  namespace: 'roles',
  state: {
    list: [], // 左边数据
    loading: false,
    rolePowers: [],
    math: null,
    // checkAllIndeterminate: false, // 全选按钮横岗状态
    // checkAll: false, // 全选按钮是否选中
  },

  reducers: {
    changeState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const responseRole = yield call(getRoles)
      const responseMenu = yield call(getMenu)
      const responsePermission = yield call(getPermission)
      // 处理权限列表数据
      const oneMenu = [] // 存放一级菜单
      const twoMenu = [] // 存放二级菜单
      responseMenu.forEach((ele) => {
        if (ele.parentMenuNo === 0) {
          oneMenu.push(ele)
        } else {
          twoMenu.push(ele)
        }
      })
      const menus = []
      oneMenu.forEach((ele) => {
        const children = []
        twoMenu.forEach((item) => {
          const child = []
          responsePermission.forEach((element) => {
            if (element.permissionGroup === item.permissionGroup) {
              child.push(Object.assign({ name: element.permissionTitle, key: element.permissionNo, checked: false, disabled: item.enableFlag ? false : !false }))
            }
          })
          if (item.parentMenuNo === ele.menuNo) {
            children.push(Object.assign({ name: item.menuName, key: item.menuNo, checked: false, indeterminate: false, children: child, disabled: item.enableFlag ? false : !false }))
          }
        })
        menus.push(Object.assign({ name: ele.menuName, key: ele.menuNo, children }))
      })
      // 查询一级菜单选中情况
      const checkAll = false
      const checkAllIndeterminate = false
      yield put({
        type: 'changeState',
        payload: { list: responseRole, loading: false, rolePowers: menus, checkAll, checkAllIndeterminate },
      })
    },
    *setMath(_, { call, put }) {
      yield put({
        type: 'changeState',
        payload: { math: Math.random() },
      })
    },
    *fetchT(_, { call, put }) {
      const responseRole = yield call(getRoles)
      const responseMenu = yield call(getMenu)
      const responsePermission = yield call(getPermission)
      // 处理权限列表数据
      const oneMenu = [] // 存放一级菜单
      const twoMenu = [] // 存放二级菜单
      responseMenu.forEach((ele) => {
        if (ele.parentMenuNo === 0) {
          oneMenu.push(ele)
        } else {
          twoMenu.push(ele)
        }
      })
      const menus = []
      oneMenu.forEach((ele) => {
        const children = []
        twoMenu.forEach((item) => {
          const child = []
          responsePermission.forEach((element) => {
            if (element.permissionGroup === item.permissionGroup) {
              child.push(Object.assign({ name: element.permissionTitle, key: element.permissionNo, checked: false }))
            }
          })
          if (item.parentMenuNo === ele.menuNo) {
            children.push(Object.assign({ name: item.menuName, key: item.menuNo, checked: false, indeterminate: false, children: child }))
          }
        })
        menus.push(Object.assign({ name: ele.menuName, key: ele.menuNo, children }))
      })
      // 查询一级菜单选中情况
      // const checkAll = false
      // const checkAllIndeterminate = false
      yield put({
        type: 'changeState',
        payload: { list: responseRole, loading: false, rolePowers: menus },
      })
    },
  },
}
