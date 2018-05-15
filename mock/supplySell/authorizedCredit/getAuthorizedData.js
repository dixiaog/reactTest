 /*
 * @Author: jiangteng
 * @Date: 2018-01-20 10:16:45
 * @param (无特别注释均表示可选)
 * 获取初始化基础数据
 {
    current: 1,
    pageSize: 20,
    distributorName: '分销名称'，        // 分销名称
    status: '0'                        // 状态
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                "distributorNo": 'B001',
                "distributorName": "分销名称",
                'creditTime': '2015-01-11',
                'expireTime': '2015-01-11',
                'status': '1',
                'creditAmount': '1000',
                'autoExpire': '1',
                'remark': '111',
            }
        ],
        "pagination": {
            "total": 1,
        }
    }
}
 */

import { getUrlParams } from '../../utils'

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        distributorNo: `B00-${i}`,
        distributorName: `分销商名称-${i}`,
        creditTime: '2014-01-01',
        expireTime: '2014-01-01',
        status: Math.random() * 10 > 5 ? 1 : 2,
        creditAmount: '20000',
        autoExpire: Math.random() * 10 > 5 ? 0 : 1,
        remark: '我是备注',
        })
    }
    if (searchParam) {
        if (searchParam.distributorName) { // 款式码
        list = list.filter(ele => ele.distributorName.indexOf(searchParam.distributorName) > -1)
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

export function getAuthorizedData(req, res, u, b) {
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
  getAuthorizedData,
}
