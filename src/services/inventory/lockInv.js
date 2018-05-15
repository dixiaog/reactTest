import request from '../../utils/request'
import config from '../../utils/config'

// 获取库存锁定列表
export async function getLockInventory(params) {
  return request(`${config.APIV1}/wm/lockInventory/getLockInventory`, {
    method: 'POST',
    body: params,
  })
}

export async function getSkuInfoInShopNo(params) {
  return request(`${config.APIV1}/wm/lockInventory/getSkuInfoInShopNo`, {
    method: 'POST',
    body: params,
  })
}

export async function addLockInventory(params) {
  return request(`${config.APIV1}/wm/lockInventory/addLockInventory`, {
    method: 'POST',
    body: params,
  })
}

export async function addLockInventoryByUrl(params) {
  return request(`${config.APIV1}/wm/lockInventory/addLockInventoryByUrl`, {
    method: 'POST',
    body: params,
  })
}

export async function getSkuInfoByShopUrl(params) {
  return request(`${config.APIV1}/wm/lockInventory/getSkuInfoByShopUrl`, {
    method: 'POST',
    body: params,
  })
}

export async function editLockInventoryShow(params) {
  return request(`${config.APIV1}/wm/lockInventory/editLockInventoryShow`, {
    method: 'POST',
    body: params,
  })
}

export async function editLocks(params) {
  return request(`${config.APIV1}/wm/lockInventory/editLocks`, {
    method: 'POST',
    body: params,
  })
}

export async function getLocks(params) {
  return request(`${config.APIV1}/wm/lockInventory/getLocks`, {
    method: 'POST',
    body: params,
  })
}

export async function unLockBill(params) {
  return request(`${config.APIV1}/wm/lockInventory/unLockBill`, {
    method: 'POST',
    body: params,
  })
}

export async function unLockSku(params) {
  return request(`${config.APIV1}/wm/lockInventory/unLockSku`, {
    method: 'POST',
    body: params,
  })
}

export async function importLocks(params) {
  return request(`${config.APIV1}/wm/lockInventory/importLocks`, {
    method: 'POST',
    body: params,
  })
}

export async function exportLockInv(params) {
  return request(`${config.APIV1}/wm/lockInventory/exportLocks`, {
    method: 'POST',
    body: params,
  })
}
