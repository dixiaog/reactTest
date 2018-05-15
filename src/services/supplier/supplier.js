/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: Wupeng
 * @Last Modified time: 2018-01-013 14:19:01
 * 供应商信息
 */
import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

// 供应商列表   list

export async function list(params) {
  return request(`${config.APIV1}/dm/bdsupplier/list`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// 供应商维护分类 updataTypeName
export async function updataTypeName(params) {
  return request(`${config.APIV1}/dm/bdsupplier/updataTypeName`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// selectAllClassify  供应商分类
export async function selectAllClassify(params) {
  return request(`${config.APIV1}/dm/bdsupplier/selectAllClassify`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// save 保存
export async function save(params) {
  return request(`${config.APIV1}/dm/bdsupplier/save`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// updateEnableStatus  启用禁用
export async function updateEnableStatus(params) {
  return request(`${config.APIV1}/dm/bdsupplier/updateEnableStatus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// editsave  编辑保存
export async function editsave(params) {
  return request(`${config.APIV1}/dm/bdsupplier/editsave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// delete 删除
export async function postdelete(params) {
  return request(`${config.APIV1}/dm/bdsupplier/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// exportSkus  导出excel
export async function exportSkus(params) {
  return fileExport(`${config.APIV1}/dm/bdsupplier/exportSkus`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// upload  导入excel
export async function upload(params) {
  return request(`${config.APIV1}/dm/bdsupplier/upload`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
