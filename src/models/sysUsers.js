/*
 * @Author: jiangteng
 * @Date: 2017-12-23 08:40:40
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-05 14:16:18
 */

import { message } from 'antd'
import { userManager, userEnable, userRole, getShop, getWarehouse, getCustomer, getCompany } from '../services/system'

export default {
  namespace: 'users',
  state: {
    list: [],
    total: 0,
    loading: false,
    sysRole: [],
    defRole: [],
    shopList: [],
    customerList: [],
    warehouseList: [],
    companyList: [],
    // 下面4个搜索必选
    selectedRows: [],
    selectedRowKeys: [],
    page: {},
    searchParam: {},
  },

  effects: {
    *fetch(_, { call, put, select }) {
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const searchParam = yield select(state => state.users.searchParam)
      Object.assign(searchParam, { userName: searchParam.userNameJ })
      const response = yield call(userManager, searchParam)
      const roleList = yield call(userRole) // 获取角色列表
      const shopList = yield call(getShop) // 获取店铺
      const warehouseList = yield call(getWarehouse) // 获取仓库
      const customerList = yield call(getCustomer) // 获取分销商
      const companyList = yield call(getCompany) // 获取公司名称
      const Total = response ? response.pagination.total : 0
      const sysRole = []
      const defRole = []
      const shop = []
      const warehouse = []
      const customer = []
      const company = []
      roleList.forEach((ele) => {
        if (ele.companyNo === 0) {
          sysRole.push({ label: ele.roleName, value: ele.roleNo })
        } else {
          defRole.push({ label: ele.roleName, value: ele.roleNo })
        }
      })
      shopList.forEach((ele) => {
        shop.push({ label: ele.shopName, value: ele.shopName, title: ele.shopNo })
      })
      warehouseList.forEach((ele) => {
        warehouse.push({ label: ele.warehouseName, value: ele.warehouseName, title: ele.warehouseNo })
      })
      customerList.forEach((ele) => {
        customer.push({ label: ele.distributorName, value: ele.distributorName, title: ele.distributorNo })
      })
      companyList.forEach((ele) => {
        company.push({ label: ele.companyName, value: ele.companyName, title: ele.companyNo })
      })
      yield put({
        type: 'changeState',
        payload: { ...response, total: Total, loading: false, sysRole, defRole, shopList: shop, warehouseList: warehouse, customerList: customer, companyList: company },
      })
    },
    *search({ payload }, { call, put, select }) {
      const statePage = yield select(state => state.users.page)
      const page = payload && payload.page ? Object.assign(statePage, payload.page) : statePage
      const searchParam = payload && payload.searchParam ? payload.searchParam : yield select(state => state.users.searchParam)
      Object.assign(searchParam, { userName: searchParam.userNameJ })
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(userManager, { ...searchParam, ...page })
      const Total = response ? response.pagination.total : 0
      yield put({
        type: 'changeState',
        payload: { ...response, loading: false, searchParam, page, total: Total, selectedRows: [], selectedRowKeys: [] },
      })
    },
    *enable({ payload }, { call, put, select }) {
      const selectedRowKeys = yield select(state => state.users.selectedRowKeys)
      yield put({
        type: 'changeState',
        payload: { loading: true },
      })
      const response = yield call(userEnable, { selectedRowKeys, payload })
      if (response) {
        yield put({
          type: 'search',
        })
      } else {
        yield put({
          type: 'changeState',
          payload: { loading: false },
        })
        message.error('用户启用/禁用失败')
      }
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
