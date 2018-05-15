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
    const list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        orderNo: `00-${i}`,
        innerNo: `A00-${i}`,
        productName: '商品名称',
        onlineNo: `123456-${i}`,
        orderDate: 57333536465756757,
        payTime: 57333536465756757,
        siteBuyerNo: '买家账号',
        shopName: '买家店铺',
        payAmount: '100',
        expressAmount: '10',
        actualPayment: '8888',
        orderStatus: Math.random() * 10 > 5 ? 1 : 2,
        buyerRemark: '买家留言',
        sellerRemark: '卖家备注',
        orderLabel: '订单便签',
        expressCorpName: '顺丰',
        province: '江苏省',
        city: '常熟市',
        county: '虞山镇',
        address: '具体地址',
        distributorName: '分销商名称',
        weight: '200',
        invoiceTitle: '发票抬头',
        invoiceTaxNo: '发票税号',
        deliveryTime: 57333536465756757,
        deliveryTimeA: 57333536465756757,
        warehouseName: '发货仓',
        fApproveUserName: '业务员',
        })
    }
    return { list, total: list.length }
}

export function getOrderSearchData(req, res, u, b) {
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
  getOrderSearchData,
}
