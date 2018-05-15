/*
 * @Author: tanmengjia
 * @Date: 2018-03-06 15:33:57
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-06 15:49:07
 * 获取退款单列表
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`, // 内部退款号
        shopName: `店铺-${i}`,
        refundTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        approveDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        innerNo: `内部订单号-${i}`,
        onlineNo: `线上订单号-${i}`,
        billNo: `退款单号-${i}`,
        amount: (`${i}` * 1) + 20,
        status: Math.random() * 10 > 5 ? 0 : 1,
        refundStatus: Math.random() * 10 > 5 ? 0 : 1,
        modeNo: Math.random() * 10 > 5 ? 1 : 2,
        payAccount: `买家支付账号-${i}`,
        siteAccount: `买家店铺账号-${i}`,
        afterSaleNo: `售后单号-${i}`,
        asType: Math.random() * 10 > 5 ? 1 : 2,
        refundReason: `售后问题类型-${i}`,
        remark: `售后备注-${i}`,
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
  export function getRefundOrder(req, res, u, b) {
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
    getRefundOrder,
}
