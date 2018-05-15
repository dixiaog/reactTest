import request from '../../utils/request'
import config from '../../utils/config'
import fileExport from '../../utils/fileExport'

// 查询
export async function getSpecialPrice(params) {
    return request(`${config.APIV1}/dm/priceStrategy/getPriceStrategyData`, {
        method: 'POST',
        body: { ...params },
    })
}

export async function getStrategyChild(params) {
    return request(`${config.APIV1}/dm/priceStrategy/getDmPriceStrategyD`, {
        method: 'POST',
        body: params,
    })
}


// 导出
export async function exportStrategy(params) {
    return fileExport(`${config.APIV1}/dm/priceStrategy/exportDB`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 删除特殊价格策略
export async function deletePriceStrategy(params) {
    return request(`${config.APIV1}/dm/priceStrategy/delete`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

// 编辑/新增特殊价格策略
export async function save(params) {
    return request(`${config.APIV1}/dm/priceStrategy/save`, {
      method: 'POST',
      body: {
        ...params,
      },
    })
  }

export async function getChooseData(params) {
    return request(`${config.APIV1}/dm/priceStrategy/getByStrategyNo `, {
        method: 'POST',
        body: params,
    })
}
