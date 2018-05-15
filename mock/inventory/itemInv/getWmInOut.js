/*
 * @Author: tanmengjia
 * @Date: 2018-02-03 10:21:18
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-03 13:44:50
 * 获取主仓库存进出明细流水
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        billType: Math.random() * 10 > 5 ? 1 : 2,
        billDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        billNum: ((`${i}` * 1) + 50),
        billNo: `我是进出单仓号-${i}`,
        exBillNo: `我是内部订单号-${i}`,
        warehouseName: `我是仓储方-${i}`,
        shopName: `我是店铺-${i}`,
        remark: `我是备注-${i}`,
        createUser: `我是操作人-${i}`,
        // 进出类型
        ioType: Math.random() * 10 > 5 ? -1 : 1,
      })
    }
    if (searchParam && searchParam.billType) {
      list = list.filter(ele => ele.billType.indexOf(searchParam.billType) > -1)
    }
    if (searchParam && searchParam.brandName) {
      list = list.filter(ele => ele.brandName.indexOf(searchParam.brandName) > -1)
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
}

export function getWmInOut(req, res, u, b) {
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
    getWmInOut,
}

