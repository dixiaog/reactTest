 /*
 * @Author: jiangteng
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 * 获取初始化基础数据
 {
    current: 1,
    pageSize: 20,
    skuNo: ''，        // 查询携带参数
    ...........        // 查询携带参数
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                "billNo": 163,                      // 自动编码
                "billDate": "2015-0101",
                "billType": "0"
                .......
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

import { getUrlParams } from '../../utils'

export function getList(count) {
    const list = [{
        productImage: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        skuNo: 'BSD-001-3',
        productName: `冬款羽绒-${1}`,
        salePrice: '1234',
        retailPrice: '888',
        orderNum: '5000',
        saleAmount: '10000',
        lockInventory: '10',
      }, {
        productImage: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        skuNo: 'BSD-001-4',
        productName: `冬款羽绒-${2}`,
        orderNum: '8000',
        salePrice: '3000',
        retailPrice: '777',
        saleAmount: '10000',
        lockInventory: '20',
      }]
    return { list, total: list.length }
}

export function getOrderDetail(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    const result = getList(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
}

export default {
  getOrderDetail,
}
