
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

/*
 * 供销-财务-授信管理
 */

// 供销-财务-授信管理列表页
export async function getAuthorizedData(params) {
  // if (params.status === undefined || params.status === '-1') {
  //   Object.assign(params, { status: undefined })
  // }
  return request(`${config.APIV1}/dm/creditLine/getAuthorizedData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-财务-新增授信
export async function addAuthorized(params) {
  return request(`${config.APIV1}/dm/creditLine/addAuthorized`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-财务-修改授信
export async function editAuthorized(params) {
  return request(`${config.APIV1}/dm/creditLine/editAuthorized`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-获取分销商列表
export async function getDistributorList() {
  return request(`${config.APIV1}/dm/creditLine/getDistributorList`, {
    method: 'POST',
  })
}

// 授信-改变状态
export async function editAutStatus(params) {
  return request(`${config.APIV1}/dm/creditLine/editAutStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 授信-导出资料
export async function exportData(params) {
  Object.assign(params, { fileName: '授信管理资料.xls' })
  return fileExport(`${config.APIV1}/dm/creditLine/exportAuthorizedData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 授信-获取单笔资料
export async function getCreditLineByAutoNo(params) {
  return request(`${config.APIV1}/dm/creditLine/getCreditLineByAutoNo`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
