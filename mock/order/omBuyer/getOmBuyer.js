/*
 * @Author: tanmengjia
 * @Date: 2018-02-05 13:19:53
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-05 15:10:47
 * 获取客户列表
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        buyerNo: `${i}`,
        siteBuyerNo: `我是买家账号-${i}`,
        siteName: `我是商店站点-${i}`,
        receiver: `我是用户姓名-${i}`,
        address: `我是联系地址-${i}`,
        telNo: '0512-51111111',
        mobileNo: '13112341234',
        createTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        modifyTime: moment().format('YYYY-MM-DD HH:mm:ss'),
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
  export function getOmBuyer(req, res, u, b) {
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
    getOmBuyer,
}

