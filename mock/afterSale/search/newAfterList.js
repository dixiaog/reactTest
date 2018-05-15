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

export function getList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
        refundId: `00-${i}`,
        asDate: '2014-01-01',
        siteBuyerNo: '买家账号',
        shopName: '店铺',
        siteOrderNo: '000123',
        payAmount: 100,
        actualPayment: 20,
        actualReturnAmount: '线下订单',
        receiver: '收货人',
        mobileNo: '13913721839',
        telNo: '0513-222222',
        sellerRemark: '卖家备注',
        buyerRemark: '买家备注',
        address: '收货地址',
        expressCorpNo: '顺丰',
        expressNo: 'SF1231312313',
        })
    }
    if (searchParam) {
        if (searchParam.refundId) { // 售后单号
        list = list.filter(ele => ele.refundId.indexOf(searchParam.refundId) > -1)
        }
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
    return { list, total: list.length ? list.length : 0 }
}

export function newAfterList(req, res, u, b) {
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
  newAfterList,
}
