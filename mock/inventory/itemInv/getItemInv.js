/*
 * @Author: tanmengjia
 * @Date: 2018-02-01 19:27:08
 * @Last Modified by: tanmengjia
 * @Last Modified time: 2018-02-01 19:43:49
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
        productImage: avatars[i % 8],
        productNo: `我是款式编码-${i}`,
        skuNo: `我是商品编码-${i}`,
        productName: `我是商品名-${i}`,
        productSpec: `我是颜色规格-${i}`,
        inventoryNum: ((`${i}` * 1) + 100),
        lockNum: ((`${i}` * 1) + 10),
        occupyNum: ((`${i}` * 1) + 30),
        all: ((`${i}` * 1) + 60),
        allUser: ((`${i}` * 1) + 40),
        virtualNum: ((`${i}` * 1) + 150),
        safetyLowerLimit: ((`${i}` * 1) + 50),
        safetyUpperLimit: ((`${i}` * 1) + 150),
        waitDeliveryNum: ((`${i}` * 1) + 5),
        returnWarehouseNum: `${i}`,
        inWarehouseNum: ((`${i}` * 1) + 70),
        defectiveWarehouseNum: ((`${i}` * 1) + 5),
        onWayNum: ((`${i}` * 1) + 15),
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
  export function getItemInv(req, res, u, b) {
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
    getItemInv,
}
