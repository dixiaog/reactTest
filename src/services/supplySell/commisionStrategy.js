import request from '../../utils/request'
import config from '../../utils/config'

// 分销佣金策略列表
export async function getCommisionStrategy(params) {
    return request(`${config.APIV1}/dm/commisionStrategy/selCommisionStrategy`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function getChooseData(params) {
  return request(`${config.APIV1}/dm/commisionStrategy/selCommisionStrategyBystrategyNo`, {
      method: 'POST',
      body: {
          ...params,
        },
  })
}

// 获得最大分销商层级
export async function getFxLevelMax() {
  return request(`${config.APIV1}/dm/commisionStrategy/selFxLevelMaxBycompanyNo`, {
      method: 'POST',
  })
}

// 分销商列表
export async function getDistributor() {
    return request(`${config.APIV1}/dm/relationship/getRelationshipList`, {
        method: 'POST',
    })
}

// 启用/禁用
export async function enableCommisionStrategy(params) {
    return request(`${config.APIV1}/dm/commisionStrategy/updateEnableStatus`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
}

// 添加/编辑分销佣金策略
export async function saveCommisionStrategy(params) {
    return request(`${config.APIV1}/dm/commisionStrategy/saveCommisionStrategy`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }
