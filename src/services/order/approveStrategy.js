import request from '../../utils/request'
import config from '../../utils/config'

// 订单审核列表
export async function getApproveStrategy(params) {
    return request(`${config.APIV1}/om/approvestrategy/list`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 保存/编辑订单审核规则
export async function saveApprove(params) {
    return request(`${config.APIV1}/om/approvestrategy/addSave`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function getChooseData(params) {
    return request(`${config.APIV1}/om/approvestrategy/getDetail`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 启用/禁用
export async function enable(params) {
    return request(`${config.APIV1}/om/approvestrategy/enableStatus`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}
