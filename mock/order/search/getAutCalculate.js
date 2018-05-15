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

export function getList() {
    const list = [{
        name: '12345',
        billDate: ['a10'],
        relativeBillNo: ['0', '1', '2'],
        supplierName: 0,
        yanchi: '1',
        enable: 0,
        startTime: '2015-01-01',
        endTime: '2018-01-01',
        kaishi: '2017-01-29',
        jiezhi: '2017-09-02',
      }, {
        name: '123456',
        billDate: ['a10'],
        relativeBillNo: ['1', '3', '4'],
        supplierName: 1,
        yanchi: '13',
        enable: 1,
        startTime: '2015-01-01',
        endTime: '2018-01-01',
        kaishi: '2017-01-29',
        jiezhi: '2017-09-02',
      }]
    return { list, total: list.length }
}

export function getAutCalculate(req, res, u, b) {
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
  getAutCalculate,
}
