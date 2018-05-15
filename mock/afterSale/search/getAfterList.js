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
        asNo: `198901-${i}`,
        refundId: `00-${i}`,
        asDate: '2015-01-01',
        asType: Math.random() * 10 > 5 ? 0 : 1,
        siteBuyerNo: '江腾淘宝',
        receiver: '江腾',
        mobileNo: '13913621930',
        shopName: '店铺名称',
        warehouseNo: Math.random() * 10 > 5 ? 0 : 1,
        warehouseName: '仓库名称',
        actualReturnAmount: 100,
        siteBuyerNoTui: '退款账号',
        refundReason: '问题类型',
        remark: '备注',
        addressDetail: '处理结果',
        asStatus: Math.random() * 10 > 5 ? 0 : 2,
        skuNo: '100',
        productName: '商品名称',
        productSpec: '男士长款大衣',
        returnNum: 20,
        inNum: 10,
        goodStatus: Math.random() * 10 > 5 ? 'SELLER_RECEIVED' : 'BUYER_NOT_RECEIVED',
        refundStatus: '已退款',
        orderNo: '001230812',
        expressCorpNo: '顺丰',
        expressNo: 'SF21313',
        registrationUser: '江腾',
        registrationTime: '2019-09-09',
        confirmUser: '江腾',
        confirmTime: '2015-01-01',
        updateUser: '江腾',
        updateTime: '2015-01-01',
        })
    }
    if (searchParam) {
        if (searchParam.asNo) { // 售后单号
        list = list.filter(ele => ele.asNo.indexOf(searchParam.asNo) > -1)
        }
        if (searchParam.asStatus) { // 状态
        list = list.filter(ele => ele.asStatus.indexOf(searchParam.asStatus) > -1)
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

export function getAfterList(req, res, u, b) {
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
  getAfterList,
}
