import request from '../../utils/request'
import config from '../../utils/config'

// 特殊单策略数据
export async function getData(params) {
    return request(`${config.APIV1}/om/specialstrategy/getCase`, {
        method: 'POST',
        body: params,
    })
}

// 添加特殊单策略
export async function saveSpecialStrategy(params) {
    return request(`${config.APIV1}/om/specialstrategy/addSave`, {
        method: 'POST',
        body: params,
    })
}

// 订单拆分策略获取策略
export async function getSplitStrategy(params) {
    return request(`${config.APIV1}/om/splitstrategy/selectSplitStrategyList`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 删除订单拆分策略
export async function deleteSplitStrategy(params) {
    return request(`${config.APIV1}/om/splitstrategy/delSplitStrategy`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 添加/编辑拆分策略
export async function saveSplitStrategy(params) {
    return request(`${config.APIV1}/om/splitstrategy/insertSplitStrategy`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 订单拆分
export async function doSplit(params) {
    return request(`${config.APIV1}/om/splitstrategy/affirmSplit`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 预售按批次拆分列表
export async function getSku(params) {
    return request(`${config.APIV1}/om/splitstrategy/SplitAnalyze`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 预售按批次拆分确认拆分
export async function savePresell(params) {
    return request(`${config.APIV1}/om/splitstrategy/affirmSplitPresale`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 保存财务审核
export async function saveFApproveStrategy(params) {
    return request(`${config.APIV1}/om/omFApproveStrategy/save`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 财务审核数据
export async function getFApproveStrategy(params) {
    return request(`${config.APIV1}/om/omFApproveStrategy/list`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}
