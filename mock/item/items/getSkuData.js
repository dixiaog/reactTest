/*
 * @Author: chenjie
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
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
                "autoNo": 163,                      // 自动编码
                "skuNo": "000001A",                 // 款式编码
                "barcode": "",
                "productNo": "000001",              // 款式编码
                "productType": 1,
                "productAttribute": 0,
                "specMapping": "0",
                "productSpec": "黄色",
                "referWeight": 0,
                "productName": "000001",            // 商品名
                "shortName": "测试",
                "brandNo": 0,
                "brandName": "",
                "imageUrl": "",
                "categoryNo": 100103,
                "categoryName": "",
                "standardNo": "",
                "costPrice": 0,
                "retailPrice": 0,
                "tagPrice": 0,
                "supplyPrice1": 0,
                "supplyPrice2": 0,
                "supplyPrice3": 0,
                "supplyPrice4": 0,
                "supplyPrice5": 0,
                "distributionPrice1": 0,
                "distributionPrice2": 0,
                "distributionPrice3": 0,
                "distributionPrice4": 0,
                "distributionPrice5": 0,
                "supplierNo": "",
                "supplierName": "",
                "supplierProductNo": "",
                "supplierSkuNo": "",
                "retailCapacityLimit": 0,
                "entireCapacityLimit": 0,
                "standardBoxing": 0,
                "inventorySync": 1,
                "enableStatus": 1,
                "companyNo": 0,
                "ts": 1516414529000
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
import { getUrlParams } from './utils'

export function skuList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        autoNo: `${i}`, // 自动编码
        imageUrl: '', // 图片
        productNo: `bsd-item-${i}`, // 款式编码
        skuNo: `bsd-item-${i}`, // 商品编码
        productName: `冬款羽绒-${i}`, // 商品名
        retailCapacityLimit: 100, // 零售库容上限
        entireCapacityLimit: 100, // 整存库容上限
        standardBoxing: 10, // 标准装箱数量
        shortName: `冬款羽绒-${i}`, // 商品简称
        productSpec: Math.random() * 10 > 5 ? 'OTHER' : 'RED', // 颜色及规格
        brandNo: 'BSD', // 品牌No
        brandName: '波司登', // 品牌
        enableStatus: Math.random() * 10 > 5 ? 'true' : 'false', // 启用
        })
    }
    if (searchParam) {
        if (searchParam.iId) { // 款式码
        list = list.filter(ele => ele.iId.indexOf(searchParam.iId) > -1)
        }
        if (searchParam.itemName) { // 商品名
        list = list.filter(ele => ele.itemName.indexOf(searchParam.itemName) > -1)
        }
        if (searchParam.itemAbb) { // 商品简称
        list = list.filter(ele => ele.itemAbb.indexOf(searchParam.itemAbb) > -1)
        }
        if (searchParam.color) { // 颜色及规格
        list = list.filter(ele => ele.color.indexOf(searchParam.color) > -1)
        }
        if (searchParam.enable) { // 启用
        list = list.filter(ele => ele.enable === searchParam.enable)
        }
    }
    return { list, total: list.length }
}

export function getSkuData(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    const result = skuList(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
}

export default {
  getSkuData,
}
