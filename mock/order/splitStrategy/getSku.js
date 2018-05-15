/*
 * @Author: tanmengjia
 * @Date: 2018-02-10 10:52:18
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-10 15:12:34
 * 预售按批次拆分获取列表
 * {
    orderType 0:1 // 选择的拆分的订单的方法，1：按搜索条件，0：按选择的
    searchParam // 搜索条件
    selectedRows:(2) [{…}, {…}] //选择的订单
 }
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        skuNo: `商品编码-${i}`,
        productNo: `款式编码-${i}`,
        productSpec: `规格-${i}`,
        skuNum: `${i}`,
        orderNum: `${i}`,
        orderDate: moment().format('YYYY-MM-DD'),
        // orderDate: moment().format('1899-11-30'),
        lockInventory: `${i}`,
        isSplit: Math.random() * 10 > 5 ? 0 : 1,
      })
    }
    if (searchParam && searchParam.siteBuyerNo) {
      list = list.filter(ele => ele.siteBuyerNo.indexOf(searchParam.siteBuyerNo) > -1)
    }
    if (searchParam && searchParam.brandName) {
      list = list.filter(ele => ele.brandName.indexOf(searchParam.brandName) > -1)
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }
  export function getSku(req, res, u, b) {
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
    getSku,
}
