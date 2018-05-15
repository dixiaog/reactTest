/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 13:19:53
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-09 15:09:42
 * 拆分策略
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        strategyNo: `${i}`,
        strategyName: `拆分策略-${i}`,
        splitHistoryFlag: Math.random() * 10 > 5 ? 0 : 1,
        mergeHistoryFlag: Math.random() * 10 > 5 ? 0 : 1,
        splitType: Math.random() * 10 > 5 ? 4 : 5,
        oldMinAmount: (`${i}` * 1) + 20,
        newMinAmount: (`${i}` * 1) + 15,
        inventoryRate: (`${i}` * 1) + 5,
        includeProduct: '款号1,,款号2,款号3',
        includeSku: '商品编码1,商品编码2,商品编码3',
        maxNum: (`${i}` * 1) + 25,
        splitWeight: (`${i}` * 1) + 5,
        splitMinWeight: `${i}` * 1,
        enableStatus: Math.random() * 10 > 5 ? 0 : 1,
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
  export function getSplitStrategy(req, res, u, b) {
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
    getSplitStrategy,
}

