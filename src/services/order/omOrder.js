/*
 * @Author: Chen Xinjie
 * @Date: 2018-02-24 14:14:18
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-02-27 16:28:51
 * 新增订单
 */

import request from '../../utils/request'
import config from '../../utils/config'

// 手工下单
export async function addOrder() {
  return request(`${config.APIV1}/om/omOrder/addOrder`, {
      method: 'POST',
  })
}

// 增加订单明细
export async function addOrderD() {
  return request(`${config.APIV1}/om/omOrder/addOrderD`, {
      method: 'POST',
  })
}

// 更新订单明细
export async function updateOrderD() {
  return request(`${config.APIV1}/om/omOrder/updateOrderD`, {
      method: 'POST',
  })
}

// 删除订单明细
export async function deleteOrderD() {
  return request(`${config.APIV1}/om/omOrder/deleteOrderD`, {
      method: 'POST',
  })
}

// 修改订单主表
export async function updateOrder() {
  return request(`${config.APIV1}/om/omOrder/updateOrder`, {
      method: 'POST',
  })
}

// 选择店铺
export async function getShop() {
  return request(`${config.APIV1}/om/omOrder/getShop`, {
      method: 'POST',
  })
}
