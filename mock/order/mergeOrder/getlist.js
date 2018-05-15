/*
合并订单-获取订单列表
 {
   orderNo  订单编号
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                orderNo             // 订单编号
                siteOrderNo         // 线上订单编号
                shopName            // 店铺名称
                siteBuyerNo         // 平台买家账号
                payTime             // 付款时间
                paymentNo           // 付款方式(0: 支付宝; 1: 银行转账; 2: 现金支付; 3: 京东-货到付款; 4: 京东-在线支付; 5: 京东-分期付款; 6: 京东-公司转账; 7: 唯品会; 8: 内部流转; 9: 供销支付; 10: 快速支付; 11: 其他)
                receiver            // 收货人
                province            // 省/直辖市
                city                // 地级市/市辖区/市辖县
                county              // 县级市/区/县
                address             // 详细地址
                actualPayment       // 实付金额
                orderStatus         // 订单状态(0: 待付款; 1: 已付款待审核; 10: 已客审待财审; 2: 发货中; 20: 等待第三方发货; 3: 已发货; 4: 异常; 40: 已取消; 41: 被合并; 42: 被拆分)
                buyerRemark
                sellerRemark
                oderDetails: [
                    {
                        productImage        // 商品图片
                        orderNum            // 订单数量
                    }
                    {...},
                    {...},
                ]
            },
            {...},
            {...},
        ],
    }
}

 */

import { getUrlParams } from '../../utils'

export function listShow(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        orderNo: `${i}`,
        siteOrderNo: `132-${i}`,
        shopName: `东店铺-${i}`,
        siteBuyerNo: Math.random() * 10 > 5 ? 3 : 4,
        payTime: new Date(),
        paymentNo: Math.ceil(Math.random() * 10),
        actualPayment: Math.ceil(Math.random() * 100),
        receiver: `收货人-${i}`,
        province: Math.random() * 10 > 5 ? '南京' : '北京',
        city: '东城',
        county: '朝阳',
        address: '管委会',
        orderStatus: Math.ceil(Math.random() * 10),
        buyerRemark: Math.random() * 10 > 5 ? 3 : '',
        sellerRemark: Math.random() * 10 > 5 ? 12 : '',
        oderDetails: [{
            productImage: 'http://pic-bucket.nosdn.127.net/photo/0010/2018-02-08/DA5GRTPK50CB0010NOS.jpg',
            orderNum: Math.ceil(Math.random() * 10),
        }],
      })
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }

  export function getMegerList(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 3
    // const result = itemList(count)
    const result = listShow(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getMegerList,
}
