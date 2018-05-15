/*
 * @Author: chenjie
 * @Date: 2018-01-23 16:43:05
 * 公共方法
 */
import request from '../utils/request'
import config from '../utils/config'

// 获取所有店铺
export async function getAllShop(params) {
    return request(`${config.APIV1}/prodm/shop/sku/getAllShop`, {
        method: 'POST',
        body: {
        ...params,
        },
    })
}
