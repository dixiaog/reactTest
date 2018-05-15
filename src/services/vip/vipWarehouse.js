import request from '../../utils/request'
import config from '../../utils/config'

// 获取唯品会送货仓列表
export async function getVipWarehouse(params) {
    return request(`${config.APIV1}/basem/bdShopWarehouse/listSearch`, {
      method: 'POST',
      body: {
          ...params,
        },
    })
}

export async function getChooseData(params) {
  return request(`${config.APIV1}/basem/bdShopWarehouse/selectByNo `, {
    method: 'POST',
    body: {
        ...params,
      },
  })
}

// 编辑保存
export async function saveVipWarehouse(params) {
  return request(`${config.APIV1}/basem/bdShopWarehouse/editsave`, {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

// 批量删除
export async function deleteAll(params) {
  return request(`${config.APIV1}/basem/bdShopWarehouse/deleteShopWarehouse`, {
    method: 'POST',
    body: params,
  })
}

// 重新下载
export async function reset() {
  return request(`${config.APIV1}/basem/bdShopWarehouse/reloadShopWarehouse`, {
    method: 'POST',
  })
}
