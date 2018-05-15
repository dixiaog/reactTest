/*
 * @Author: tanmengjia
 * @Date: 2018-01-24 17:02:44
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-01-24 17:05:24
 {
    current: 1,
    pageSize: 20,
  }
  * @return （此处data中返回）
  {
    "data": {
        "list": [
            {
                strategyNo: `${i}`,
                strategyName: `我是策略-${i}`,
                priorityLevel: `${i}`,
                beginTime: moment().format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD'),
                enableStatus: Math.random() * 10 > 5 ? 0 : 1,
                upperLimit: `200${i}`,
                lowerLimit: `100${i}`,
                distributorLevel: `${i}`,
                distributorName: `我是分销商-${i}`,
                balanceType: Math.random() * 10 > 5 ? 1 : 2,
                balanceMode: Math.random() * 10 > 5 ? 0 : 1,
                balanceValue: `150${i}`,
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

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        strategyNo: `${i}`,
        strategyName: `我是策略-${i}`,
        priorityLevel: `${i}`,
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        enableStatus: Math.random() * 10 > 5 ? 0 : 1,
        upperLimit: `200${i}`,
        lowerLimit: `100${i}`,
        distributorLevel: `${i}`,
        distributorName: `我是分销商-${i}`,
        balanceType: Math.random() * 10 > 5 ? 1 : 2,
        balanceMode: Math.random() * 10 > 5 ? 0 : 1,
        balanceValue: `150${i}`,
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
  export function getCommisionStrategy(req, res, u, b) {
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
    getCommisionStrategy,
}
