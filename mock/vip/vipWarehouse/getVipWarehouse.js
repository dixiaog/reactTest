/*
 * @Author: tanmengjia
 * @Date: 2018-04-02 13:18:36
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-04-02 13:22:16
 */
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        shopName: `我是店铺-${i}`,
        warehouseNo: `仓库编号-${i}`,
        warehouseName: `仓库名称-${i}`,
        remark: `说明-${i}`,
        province: `省-${i}`,
        city: `市-${i}`,
        county: `区-${i}`,
        address: `地址-${i}`,
        contacts: `联系人-${i}`,
        mobileNo: '13111111111',
        telNo: '0512-12345678',
      })
    }
    if (searchParam) {
        if (searchParam.productNo) { // 款式码
        list = list.filter(ele => ele.productNo.indexOf(searchParam.productNo) > -1)
        }
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: list.length }
  }
  export function getVipWarehouse(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    // const result = itemList(count)
    const result = specialPrice(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getVipWarehouse,
}
