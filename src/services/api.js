import request from '../utils/request'
import config from '../utils/config'

export async function getShops() {
  return request('/base/getShops')
}


// 打印模板列表页
export async function getPrints(params) {
  console.log('获取参数', params)
  return request(`${config.APIV1}/basem/print/getPrintTemplateData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 打印模板/ 获取模板类型
export async function getTypes(params) {
  return request(`${config.APIV1}/basem/print/getAllTemplateType`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 新增模板/编辑模板
export async function saveTemp(params) {
  return request(`${config.APIV1}/basem/print/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 设为默认模板
export async function getDefault(params) {
  return request(`${config.APIV1}/basem/print/changeDefault`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取模板信息
export async function getTemp(params) {
  return request(`${config.APIV1}/basem/print/getViewDataByAutoNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 根据type获取默认模板
export async function getDefultTemplate(params) {
  return request(`${config.APIV1}/basem/print/getDefultTemplate`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function printEditSave(params) {
  return request(`${config.APIV1}/basem/print/editSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getRolePowers() {
  return request('/base/rolePowers')
}

export async function getRoles() {
  return request('/base/roles')
}

export async function getToJava() {
  return request('http://172.16.17.97:18080/demo/getBdAttribute?attributeNo=0')
}

export async function postPowers(params) {
  return request('http://172.16.17.97:18080/demo/postBdAttribute', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getPowers(params) {
  return request('/base/powers', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取店铺管理信息
export async function getShoplist(params) {
  console.log('店铺管理参数', params)
  return request(`${config.APIV1}/basem/bdshop/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


export async function enableShop(params) {
  return request(`${config.APIV1}/basem/bdshop/editEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取店铺管理信息
export async function getSite() {
  return request(`${config.APIV1}/basem/site/selectAll`, {
    method: 'POST',
  })
}

// 编辑保存店铺信息
export async function editShop(params) {
  return request(`${config.APIV1}/basem/bdshop/editsave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 新增店铺信息
export async function addShop(params) {
  console.log('新增店铺参数', params)
  return request(`${config.APIV1}/basem/bdshop/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 店铺授权
export async function tokenShop(params) {
  return request(`${config.APIV1}/sync/stockLockingSync/returnToken`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getDiclist(params) {
  return request('/api/diclist', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getExpresslist(params) {
  return request('/api/expresslist', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取商品维护列表
export async function getCnames() {
  return request('/api/getCnames')
}
export async function getItems(params) {
  // return request('/api/items')
  return request(`${config.APIV1}/prodm/sku/getSkuData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getSpec(params) {
  return request('/api/getSpec', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function getMenus() {
  return request('/api/menus')
}


export async function queryProjectNotice() {
  return request('/api/project/notice')
}

export async function queryActivities() {
  return request('/api/activities')
}

export async function queryRule(params) {
  return request(`/api/rule?${JSON.stringify(params)}`)
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  })
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  })
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  })
}

export async function fakeChartData() {
  return request('/api/fake_chart_data')
}

export async function queryTags() {
  return request('/api/tags')
}

export async function queryBasicProfile() {
  return request('/api/profile/basic')
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced')
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${JSON.stringify(params)}`)
}

export async function fakeAccountLogin(params) {
  return request('/sys/login', {
    method: 'POST',
    body: params,
  })
}

export async function fakeMobileLogin(params) {
  return request('/api/login/mobile', {
    method: 'POST',
    body: params,
  })
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  })
}

export async function queryNotices() {
  return request('/api/notices')
}

// 根据类目编号获取类目属性
export async function getCategoryAttributeByNo(params) {
  console.log('params', params)
  return request(`${config.APIV1}/prodm/sku/getCategoryAttributeByNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 根据类目编号获取类目规格
export async function getCategorySpecByNo(params) {
  console.log('params', params)
  return request(`${config.APIV1}/prodm/sku/getCategorySpecByNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

