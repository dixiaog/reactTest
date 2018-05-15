/*
 * @Author: tanmengjia
 * @Date: 2018-01-25 13:15:17
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-01-26 10:41:05
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        distributorNo: `${i}`,
        distributorName: `我是分销商-${i}`,
        enableStatus: Math.random() * 10 > 5 ? 0 : 1,
        productNo: `我是款式编码-${i},我是款式编码哥-${i}，我是款式编弟-${i}，我是款式编码姐-${i}，我是款式编码爸-${i}`,
        limitType: Math.random() * 10 > 5 ? 0 : 1,
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
  export function getProductLimit(req, res, u, b) {
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
    getProductLimit,
}
