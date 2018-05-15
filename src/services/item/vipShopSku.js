import request from '../../utils/request'
import config from '../../utils/config'

export async function getVipShopSku(params) {
  return request(`${config.APIV1}/prodm/vipShop/sku/getVipShopSkuData`, {
      method: 'POST',
      body: {
      ...params,
      },
  })
}

export async function getShopName(params) {
  return request(`${config.APIV1}/prodm/vipShop/sku/getAllVipShop`, {
    method: 'POST',
    body: {
    ...params,
    },
})
}

export async function deleteAll(params) {
  return request(`${config.APIV1}/prodm/vipShop/sku/deleteBatch`, {
      method: 'POST',
      body: params,
  })
}

export async function download(params) {
  return request(`${config.APIV1}/prodm/vipShop/sku/syncVipShopSku`, {
      method: 'POST',
      body: params,
  })
}