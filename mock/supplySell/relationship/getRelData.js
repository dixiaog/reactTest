 /*
 * @Author: jiangteng
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 * 获取初始化基础数据
 {
    current: 1,
    pageSize: 20,
    autoNo: ''，        // 查询携带参数
    ...........        // 查询携带参数
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                "autoNo": 163,                      // 自动编码
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

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        autoNo: `00-${i}`,
        supplierName: '淘宝店',
        distributorAcronyms: `助记符-${i}`,
        distributorName: '分销商名称',
        contacts: `联系人-${i}`,
        telNo: '13913621048',
        address: '常熟波司登',
        supplierRemark: '供销商备注',
        distributorRemark: '分销商备注',
        relationshipType: Math.random() * 10 > 5 ? 0 : 1,
        distributorLevel: Math.random() * 10 > 5 ? 1 : 2,
        status: Math.random() * 10 > 5 ? 0 : 1,
        inventorySync: Math.random() * 10 > 5 ? 0 : 1,
        authorizeShopNum: Math.random() * 10 > 5 ? 12 : 13,
        province: '江苏省',
        city: '常熟',
        country: '虞山镇',
        })
    }
    if (searchParam) {
        if (searchParam.autoNo) { // 款式码
        list = list.filter(ele => ele.autoNo.indexOf(searchParam.autoNo) > -1)
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

export function getRelData(req, res, u, b) {
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
  getRelData,
}
