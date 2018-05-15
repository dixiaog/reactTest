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

export function getList(count) {
    const list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        supplierName: '供销商名称',
        supplierNo: 'B00001',
        distributorLevel: '4',
        supplierAcronyms: 'YTGJ',
        distributorRemark: '我方备注',
        supplierRemark: '对方备注',
        status: '1',
        })
    }
    return { list, total: list.length }
}

export function getSupData(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 1
    const result = getList(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
}

export default {
  getSupData,
}
