
import request from '../../utils/request'
import config from '../../utils/config'

/*
 * 供销-供销商
 */

// 供销-供销商列表页
export async function getSupData(params) {
  return request(`${config.APIV1}/dm/supplier/getSupplierList`, {
    method: 'POST',
    body: params,
  })
}

// 供销-修改助记符
export async function updateAcronyms(params) {
  return request(`${config.APIV1}/dm/supplier/updateAcronyms`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 供销-修改备注
export async function updateRemark(params) {
  return request(`${config.APIV1}/dm/supplier/updateRemark`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}
