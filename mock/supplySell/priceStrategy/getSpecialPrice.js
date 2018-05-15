/*
 * @Author: tanmengjia
 * @Date: 2018-01-24 17:02:44
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-01-29 16:29:22
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
                timeType: Math.random() * 10 > 5 ? 1 : 2,
                beginTime: moment().format('YYYY-MM-DD'),
                endTime: moment().format('YYYY-MM-DD'),
                specifyType: Math.random() * 10 > 5 ? 0 : 1,
                specifyDistributor: Math.random() * 10 > 5 ? '1,2,3,4' : '0',
                distributor: Math.random() * 10 > 5 ? '我是分销商-1,我是分销商-2,我是分销商-3,我是分销商-4' : '全部',
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
        timeType: Math.random() * 10 > 5 ? 1 : 2,
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        // specifyDistributor: '1,2,3,4',
        specifyType: Math.random() * 10 > 5 ? 0 : 1,
        specifyDistributor: Math.random() * 10 > 5 ? '1,2,3,4' : '0',
        distributor: Math.random() * 10 > 5 ? '我是分销商-1,我是分销商-2,我是分销商-3,我是分销商-4' : '全部',
      })
    }
    if (searchParam && searchParam.strategyName) {
      list = list.filter(ele => ele.strategyName.indexOf(searchParam.strategyName) > -1)
    }
    if (searchParam && searchParam.specifyType) {
      list = list.filter(ele => ele.specifyType.indexOf(searchParam.specifyType) > -1)
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }
  export function getSpecialPrice(req, res, u, b) {
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
    getSpecialPrice,
}
