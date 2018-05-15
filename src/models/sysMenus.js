/*
 * @Author: jiangteng
 * @Date: 2017-12-27 08:38:30
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-28 13:42:53
 */

import { getMenus } from '../services/sym/menus'
import { getPowerlist } from '../services/system'
import { menusRestruct } from '../utils/utils'

export default {
  namespace: 'menus',

  state: {
    list: [],
    loading: false,
    group: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      })
      const response = yield call(getMenus)
      const responseGroup = yield call(getPowerlist, { current: 1, pageSize: 10000 })
      const menus = menusRestruct(response)
      const group = []
      responseGroup.list.forEach((ele) => {
        group.push({ key: ele.permissionNo, value: ele.permissionTitle })
      })
      yield put({
        type: 'appendList',
        payload: menus,
      })
      yield put({
        type: 'group',
        payload: group,
      })
    },
  },

  reducers: {
    appendList(state, action) {
      return {
        ...state,
        list: action.payload,
        loading: false,
      }
    },
    changeLoading(state, action) {
      return {
        ...state,
        loading: action.payload,
      }
    },
    group(state, action) {
      return {
        ...state,
        group: action.payload,
      }
    },
  },
}
