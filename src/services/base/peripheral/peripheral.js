
/*
 * @Author: Wupeng
 * @Date: 2018-1-8 15:57:28
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-03-24 17:03:08
 * 外部设备练级配置
 */
import request from '../../../utils/request'
import config from '../../../utils/config'

// /sym/bdprinter/addSave
// 打印机设置-新增
export async function addSave(params) {
  return request(`${config.APIV1}/sym/bdprinter/addSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// POST /sym/bdprinter/deleteList
// 打印机设置-批量删除
export async function deleteList(params) {
  return request(`${config.APIV1}/sym/bdprinter/deleteList`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// /sym/bdprinter/viewData 打印机设置详情
export async function viewData(params) {
  return request(`${config.APIV1}/sym/bdprinter/viewData`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
// POST /sym/bdprinter/editSave
// 打印机设置-编辑
export async function editSave(params) {
  return request(`${config.APIV1}/sym/bdprinter/editSave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// POST /sym/bdprinter/search
// 打印机设置-列表
export async function search(params) {
  return request(`${config.APIV1}/sym/bdprinter/search`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
