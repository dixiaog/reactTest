/*
 * @Author: tanmengjia
 * @Date: 2018-01-23 10:48:16
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-01-30 15:01:49
 {
    current: 1,
    pageSize: 20,
    strategyNo: ''，
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                auto_no: `${i}`,
                skuNo: `我是商品编码-${i}`,
                productNo: `我是货号-${i}`,
                productSpec: `我是颜色-${i}`,
                specifyPrice: `我是价格-${i}`,
                retailPrice: '123',
            }
        ],
        "pagination": {
            "rows": 20,
            "total": 1,
            "totalPage": 1,
            "page": 1,
            "currentResult": 0,
            "orderBy": null
        }
    }
}
 */

import moment from 'moment'
import { getUrlParams } from '../../utils'

export function strategyChild(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        skuNo: `我是商品编码-${i}`,
        productNo: `我是货号-${i}`,
        productSpec: `我是颜色-${i}`,
        retailPrice: '123',
        specifyPrice: `${i}`,
      })
    }
    if (searchParam && searchParam.skuNo) {
      list = list.filter(ele => ele.skuNo.indexOf(searchParam.skuNo) > -1)
    }
    if (searchParam && searchParam.brandName) {
      list = list.filter(ele => ele.brandName.indexOf(searchParam.brandName) > -1)
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }
  export function getStrategyChild(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    // const result = itemList(count)
    const result = strategyChild(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getStrategyChild,
}
