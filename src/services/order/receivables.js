import request from '../../utils/request'
import config from '../../utils/config'

// 收款列表查询
export async function getfundDetailList(params) {
    return request(`${config.APIV1}/dm/fundDetail/list`, {
        method: 'POST',
        body: params,
    })
}

// 删除收款
export async function deleteByAutoNo(params) {
    return request(`${config.APIV1}/dm/fundDetail/deleteByAutoNo`, {
        method: 'POST',
        body: params,
    })
}

// 审核通过
export async function updateStatusPass(params) {
    return request(`${config.APIV1}/dm/fundDetail/updateStatusPass`, {
        method: 'POST',
        body: params,
    })
}

// 审核未通过
export async function updateStatusNotPass(params) {
    return request(`${config.APIV1}/dm/fundDetail/updateStatusNotPass`, {
        method: 'POST',
        body: params,
    })
}

// 审核作废
export async function repealStatus(params) {
    return request(`${config.APIV1}/dm/fundDetail/repealStatus`, {
        method: 'POST',
        body: params,
    })
}

// 编辑
export async function editSave(params) {
    return request(`${config.APIV1}/dm/fundDetail/editsave`, {
        method: 'POST',
        body: params,
    })
}

export async function selectByAutoNo(params) {
    return request(`${config.APIV1}/dm/fundDetail/selectByAutoNo`, {
        method: 'POST',
        body: params,
    })
}
  