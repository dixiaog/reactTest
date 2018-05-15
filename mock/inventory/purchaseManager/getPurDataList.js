 /*
 * @Author: jiangteng
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 * 获取初始化基础数据
 {
    current: 1,
    pageSize: 20,
    skuNo: ''，        // 查询携带参数
    productName '',    // 查询携带参数
    shortName: ''      // 查询携带参数
    productSpec: '',   // 查询携带参数
    enableStatus: 1,    // 查询携带参数
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

import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        billNo: `00-${i}`,
        billDate: '2015-01-01',
        supplierName: `供应商-${i}`,
        warehouseName: `仓库-${i}`,
        productName: `冬款羽绒-${i}`,
        billStatus: Math.random() * 10 > 5 ? 0 : 2,
        billNum: 100,
        billAmount: 100,
        taxRate: `3${i}`,
        exceedRate: `2${i}`,
        purchaseUserName: `采购员-${i}`,
        address: `送货地址-${i}`,
        remark: `备注-${i}`,
        approveUserName: `审核人-${i}`,
        approveTime: '2015-01-01',
        addressDetail: '浙江/杭州/西湖',
        })
    }
    if (searchParam) {
        if (searchParam.billNo) { // 款式码
        list = list.filter(ele => ele.billNo.indexOf(searchParam.billNo) > -1)
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

export function getPurData(req, res, u, b) {
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
  getPurData,
}
