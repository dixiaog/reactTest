/*
 * @Author: tanmengjia
 * @Date: 2018-03-07 09:13:19
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-03-15 10:12:47
 * 获取售后商品明细
 * {
    expressNo // 快递单号
    mobileNo  // 手机号
    oldExpressNo // 原快递单号
    receiver  // 收货人
    siteBuyerNo // 买家账号
    siteOrderNo  // 线上单号
 * }
  * @return （此处data中返回）
{
    data: list[商品信息列表]
    success: true
    errormessage:
}
 */
import moment from 'moment'
import { getUrlParams } from '../../utils'

const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
]

export function specialPrice(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: `${i}`,
        imageUrl: avatars[i % 8],
        skuNo: `商品编码-${i}`,
        productNo: `款式编码-${i}`,
        productName: `商品名称-${i}`,
        productSpec: `颜色规格-${i}`,
        supplierName: `供应商-${i}`,
        supplierNo: `${i}` * 1,
        asNo: `售后单号-${i}`,
        orderNo: `内部订单号-${i}`,
        returnNum: (`${i}` * 1) + 25,
        inNum: `${i}` * 1,
        nowReturnNum: `${i}` * 1,
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
  export function getAfterSkus(req, res, u, b) {
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
    getAfterSkus,
}
