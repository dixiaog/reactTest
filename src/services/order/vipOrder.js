/*
 * @Author: Chen Xinjie
 * @Date: 2018-02-24 14:14:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-05-07 21:03:35
 * 唯品会接单
 */

import request from '../../utils/request'
import config from '../../utils/config'

// 查看拣货单
export async function getPickNo(params) {
  console.log('查看拣货单', params)
  return request(`${config.APIV1}/basem/BdShopPickNo/getPickNo`, {
      method: 'POST',
      body: params,
  })
}

// 生成拣货单
export async function createPickNo(params) {
  console.log('生成拣货单',  params)
  return request(`${config.APIV1}/basem/BdShopPickNo/createPickNo`, {
      method: 'POST',
      body: params,
  })
}

// 按仓库
export async function createWarehouse(params) {
  console.log('按仓库', params)
  return request(`${config.APIV1}/basem/BdShopPickNo/createPickNoByWareTon`, {
      method: 'POST',
      body: params,
  })
}

