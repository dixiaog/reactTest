/*
 * @Author: tanmengjia
 * @Date: 2018-02-12 15:23:53
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-26 14:16:06
 * 获取财务审核数据
 * {
 }
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        strategyNo: `${i}` * 1,
        strategyName: `我是名称-${i}`,
        priorityLevel: `${i}` * 1,
        siteName: Math.random() * 10 > 5 ? 0 : 1,
        specifyShopName: `店铺${i},店铺${i + 20}`,
        specifyShopNo: '20,25',
        giftList: `赠品${i},赠品${i + 20}`,
        includeSku: `商品编码${i},商品编码${i + 20}`,
        includeProduct: `款式编码${i},款式编码${i + 20}`,
        minAmount: (`${i}` * 1) + 5,
        maxAmount: (`${i}` * 1) + 15,
        minNum: (`${i}` * 1) + 10,
        maxNum: (`${i}` * 1) + 20,
        beginTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        validIncluded: Math.random() * 10 > 5 ? 0 : 1,
        discountRate: `${i + 1}` * 0.01,
        cumulativeMaxNum: (`${i}` * 1) + 10,
        mobileNo: `${i}` * 1,
        eachOverNum: `${i}` * 10,
        eachOverAmount: `${i}` * 100,
        meetInventoryFlag: Math.random() * 10 > 5 ? 0 : 1,
        superposeFlag: Math.random() * 10 > 5 ? 0 : 1,
        enableStatus: Math.random() * 10 > 5 ? 0 : 1,
        createTime: moment().format('YYYY-MM-DD'),
        updateTime: moment().format('YYYY-MM-DD'),
        limitOrderType: `我是类型-${i}`,
        giftDisplayFlag: Math.random() * 10 > 5 ? 0 : 1,
        amountType: Math.random() * 10 > 5 ? 0 : 1,
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
  export function getGiftStrategy(req, res, u, b) {
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
    getGiftStrategy,
}

