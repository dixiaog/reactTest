import request from '../utils/request'
import config from '../utils/config'
import fileExport from '../utils/fileExport'


/*
 * 用户管理页面开始
 */

export async function getChooseData(params) {
  return request(`${config.APIV1}/basem/site/selectByAutoNo`, {
      method: 'POST',
      body: {
          ...params,
        },
  })
}
// 用户管理获取数据/查询
export async function userManager(params) {
  return request(`${config.APIV1}/sym/user/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理,创建用户
export async function addUser(params) {
  return request(`${config.APIV1}/sym/user/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理,编辑用户
export async function editUser(params) {
  return request(`${config.APIV1}/sym/user/edit`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理,获取用户列表
export async function userRole() {
  return request(`${config.APIV1}/sym/user/getSmRole`, {
    method: 'POST',
  })
}

// 用户管理,获取店铺列表
export async function getShop() {
  return request(`${config.APIV1}/sym/user/getBdShop`, {
    method: 'POST',
  })
}

// 用户管理,获取仓库列表
export async function getWarehouse() {
  return request(`${config.APIV1}/sym/user/getBdWarehouse`, {
    method: 'POST',
  })
}

// 用户管理,获取分销商列表
export async function getCustomer() {
  return request(`${config.APIV1}/sym/user/getBdDistributor`, {
    method: 'POST',
  })
}

// 用户管理创建   新增查询用户名是否重复
export async function userNo(params) {
  return request(`${config.APIV1}/sym/user/checkSmUser`, {
    method: 'POST',
    body: params,
  })
}

// 用户管理, 获取公司列表
export async function getCompany() {
  return request(`${config.APIV1}/sym/user/getBdCompany`, {
    method: 'POST',
  })
}

// 用户管理, 模板下载
export async function download() {
  const params = { fileName: '用户导入模板.xls' }
  return fileExport(`${config.APIV1}/sym/user/exportUser`, {
    method: 'POST',
    body: params,
  })
}

// 用户管理创建   编辑查询用户名是否重复
export async function userNoCheck(params) {
  return request(`${config.APIV1}/sym/user/checkSmUser`, {
    method: 'POST',
    body: params,
  })
}

// 用户管理禁用/启用
export async function userEnable(params) {
  const finParams = {}
  Object.assign(finParams, { userId: params.selectedRowKeys, validFlag: params.payload })
  return request(`${config.APIV1}/sym/user/isValid`, {
    method: 'POST',
    body: {
      ...finParams,
    },
  })
}

// 用户管理  批量修改角色
export async function modifyRole(params) {
  return request(`${config.APIV1}/sym/user/batchBindRole`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理  批量绑定店铺
export async function bindShop(params) {
  return request(`${config.APIV1}/sym/user/batchBindStore`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理  批量绑定分销商
export async function bindBusMan(params) {
  return request(`${config.APIV1}/sym/user/batchBindCustomer`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 用户管理  修改密码
export async function modifyPwd(params) {
  return request(`${config.APIV1}/sym/user/editPassword`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 用户管理  强制修改密码
export async function resetPwd(params) {
  return request(`${config.APIV1}/sym/user/forcePassword`, {
    method: 'POST',
    body: params,
  })
}

/*
 * 角色权限页面开始
 */

// 角色权限(左边数据)
export async function getRoles() {
  return request(`${config.APIV1}/sym/role/list`, {
    method: 'POST',
  })
}

// 角色权限(右边数据)
export async function getMenu() {
  return request(`${config.APIV1}/sym/role/menuList`, {
    method: 'POST',
  })
}

export async function getPermission() {
  return request(`${config.APIV1}/sym/role/getSmPermission`, {
    method: 'POST',
  })
}

// 修改角色名称
export async function editRole(params) {
  return request(`${config.APIV1}/sym/role/edit`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 添加角色
export async function saveRole(params) {
  return request(`${config.APIV1}/sym/role/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 绑定角色和菜单
export async function bindRoleMenu(params) {
  return request(`${config.APIV1}/sym/role/bindRoleMenu`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

/*
 * 权限资源页面开始
 */

// 权限资源 获取列表页
export async function getPowerlist(params) {
  return request(`${config.APIV1}/sym/permission/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 权限资源 获取权限群组
export async function getGrouplist() {
  return request(`${config.APIV1}/sym/permission/groups`, {
    method: 'POST',
  })
}


// 权限资源 新建保存
export async function savePower(params) {
  return request(`${config.APIV1}/sym/permission/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 权限资源 编辑保存
export async function editPower(params) {
  return request(`${config.APIV1}/sym/permission/edit`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 权限资源 删除
export async function delPower(params) {
  return request(`${config.APIV1}/sym/permission/del`, {
    method: 'POST',
    body: params,
  })
}

// 平台站点维护
export async function getAuthorize(params) {
  return request(`${config.APIV1}/basem/site/getSiteData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 平台站点/新增
export async function siteSave(params) {
  return request(`${config.APIV1}/basem/site/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}


// 平台站点/编辑保存
export async function siteEditSave(params) {
  return request(`${config.APIV1}/basem/site/editSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 平台站点/禁用
export async function siteUpdateEnableStatus(params) {
  return request(`${config.APIV1}/basem/site/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

/*
 * 数据字典页面开始
 */

 // 数据字典资料维护
export async function getDictionary(params) {
  return request(`${config.APIV1}/sym/dictionary/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取数据字典类别
export async function getTypes() {
  return request(`${config.APIV1}/sym/dictionary/gitAllDictType`, {
    method: 'POST',
  })
}

// 数据字典/新增字典
export async function Save(params) {
  return request(`${config.APIV1}/sym/dictionary/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 数据字典/删除字典
export async function deleteDictionary(params) {
  return request(`${config.APIV1}/sym/dictionary/delete`, {
    method: 'POST',
    body: params,
  })
}

// 数据字典/编辑字典
export async function editSave(params) {
  return request(`${config.APIV1}/sym/dictionary/editSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 平台站点，启用/禁用
export async function updateEnableStatus(params) {
  return request(`${config.APIV1}/basem/site/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 获取数据字典单条明细
export async function gitByAutoNo(params) {
  return request(`${config.APIV1}/sym/dictionary/gitByAutoNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 店铺授权接口日志
export async function searchInterfaceLog(params) {
  return request(`${config.APIV1}/basem/bdshop/searchInterfaceLog`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}