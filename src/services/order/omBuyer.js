import request from '../../utils/request'
import config from '../../utils/config'

// 客户列表
export async function getOmBuyer(params) {
    return request(`${config.APIV1}/om/ombuyer/selectBuyerInfo`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 编辑客户资料
export async function editOmBuyer(params) {
    return request(`${config.APIV1}/om/ombuyer/editBuyerInfo`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 添加客户资料
export async function addOmBuyer(params) {
    return request(`${config.APIV1}/om/ombuyer/addSave`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}
