import request from '../../utils/request'
import config from '../../utils/config'
// import fileExport from '../../utils/fileExport'

// 赠品规则数据
export async function getGiftStrategy(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/list`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

export async function getChooseData(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/selectByStrategyNo`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 导出符合条件单据
export async function exportOrder(params) {
    console.log('导出符合条件单据', params)
    // return fileExport(`${config.APIV1}/prodm/combo/listExport`, {
    //     method: 'POST',
    //     body: {
    //     ...params,
    //     },
    // })
  }

  // 启用/禁用
export async function enable(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/updateEnableStatus`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

  // 新增赠品规则
  export async function saveGiftStrategy(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/save`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

  // 编辑赠品规则
  export async function editGiftStrategy(params) {
    return request(`${config.APIV1}/om/omGiftStrategy/editsave`, {
        method: 'POST',
        body: {
            ...params,
          },
    })
}

// 获取店铺名
export async function getShopName() {
    return request(`${config.APIV1}/om/omGiftStrategy/getShop`, {
        method: 'POST',
    })
}
