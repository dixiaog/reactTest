/*
 * @Author: jiangteng
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-01-26 10:14:26
 *
 * 这个页面获取所有待选择的商品信息
 * 这个页面获取所有待选择的商品信息
 * 这个页面获取所有待选择的商品信息
 * 这个页面获取所有待选择的商品信息
 * 这个页面获取所有待选择的商品信息
 *
 {
    current: 1,
    pageSize: 20,
    skuNo: ''，
    productName '',
    shortName: ''
    productSpec: '',
    enableStatus: 1,
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                "billNo": 163,                      // 商品唯一编码
                .............                       // 下面是列表数据
                .............
                .............
            }
        ],
        "pagination": {
            "rows": 20,
            "total": 1,  // 数据总条数
            "totalPage": 1,
            "page": 1,
            "currentResult": 0,  // 返回获取信息结果（成功还是失败）
            "orderBy": null
        }
    }
}

 */
import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        productImage: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        productNo: `款式编码-${i}`,
        skuNo: `商品编码-${i}`,
        historyPrice: `00-${i}`,
        productName: `冬款羽绒-${i}`,
        purchasePrice: `商品简称-${i}`,
        paizi: `品牌-${i}`,
        productSpec: `黑色:${i}`,
        billNum: 100,
        })
    }
    if (searchParam) {
        if (searchParam.skuNo) { // 款式码
        list = list.filter(ele => ele.skuNo.indexOf(searchParam.skuNo) > -1)
        }
        // if (searchParam.itemName) { // 商品名
        // list = list.filter(ele => ele.itemName.indexOf(searchParam.itemName) > -1)
        // }
        // if (searchParam.itemAbb) { // 商品简称
        // list = list.filter(ele => ele.itemAbb.indexOf(searchParam.itemAbb) > -1)
        // }
        // if (searchParam.color) { // 颜色及规格
        // list = list.filter(ele => ele.color.indexOf(searchParam.color) > -1)
        // }
        // if (searchParam.enable) { // 启用
        // list = list.filter(ele => ele.enable === searchParam.enable)
        // }
    }
    return { list, total: list.length }
}

export function getGoodList(req, res, u, b) {
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
  getGoodList,
}
