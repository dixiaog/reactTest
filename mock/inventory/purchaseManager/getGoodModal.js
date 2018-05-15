/*
 * @Author: jiangteng
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: jiangteng
 * @Last Modified time: 2018-02-01 18:22:50
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
 * 根据采购单号, 获取此采购单下的所有商品信息 （这个接口和getGoodModal的是一样的）
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
                .............                       // 以下列表数据（参考需求文档）
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
  let list = [{
      productImage: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      productNo: `款式编码-${1}`,
      skuNo: 'BSD-001-3',
      historyPrice: `00-${1}`,
      productName: `冬款羽绒-${1}`,
      purchasePrice: '1234',
      paizi: `品牌-${1}`,
      productSpec: `黑色:${1}`,
      billNum: '500',
      price: '25000',
    }, {
      productImage: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
      productNo: `款式编码-${2}`,
      skuNo: 'BSD-001-4',
      historyPrice: `00-${2}`,
      productName: `冬款羽绒-${2}`,
      purchasePrice: '3000',
      paizi: `品牌-${2}`,
      productSpec: `黑色:${2}`,
      billNum: '800',
      price: '25000',
    }]
  // let list = []
    // for (let i = 0; i < count; i += 1) {
    //     list.push({
    //     imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
    //     productNo: `款式编码-${i}`,
    //     skuNo: `商品编码-${i}`,
    //     standardNo: `国际条形码-${i}`,
    //     productName: `冬款羽绒-${i}`,
    //     shortName: `商品简称-${i}`,
    //     brandName: `品牌-${i}`,
    //     productSpec: `黑色:${i}`,
    //     retailPrice: 100,
    //     })
    // }
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

export function getGoodModal(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 10
    const result = getList(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
}

export default {
    getGoodModal,
}
