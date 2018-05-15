/*
 * @Author: tanmengjia
 * @Date: 2018-01-24 17:02:44
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-01-29 15:50:43
 {
    current: 1,
    pageSize: 20,
  }
  * @return （此处data中返回）
  {
    "data": {
        "list": [
            {
                distributorNo: `我是分销商编号-${i}`,
                distributorName: `我是分销商名-${i}`,
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
        distributorNo: (`${i}` * 1) + 1,
        distributorName: `我是分销商名-${i}`,
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
  export function getDistributor(req, res, u, b) {
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
    getDistributor,
}
