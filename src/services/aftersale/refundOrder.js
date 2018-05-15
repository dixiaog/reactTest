import request from '../../utils/request'
import config from '../../utils/config'


// 获取退款单列表
export async function getRefundOrder(params) {
    return request(`${config.APIV1}/dm/fundDetail/selectList`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 同意退款
export async function agree(params) {
    return request(`${config.APIV1}/dm/fundDetail/updateStatus`, {
        method: 'POST',
        body: params,
    })
}

// 退款成功
export async function finish(params) {
    return request(`${config.APIV1}/dm/fundDetail/updateRefundStatus`, {
        method: 'POST',
        body: params,
    })
}

// 编辑保存
export async function saveEdit(params) {
    return request(`${config.APIV1}/dm/fundDetail/editSaveAfter`, {
        method: 'POST',
        body: params,
    })
}
