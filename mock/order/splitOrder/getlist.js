/*
拆分订单-获取订单列表
 {
   orderNo  订单编号
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
                skuNo               // 商品sku编码
                productNo           // 款式编码
                productName         // 商品名称
                referWeight         // 参考重量
                productImage        // 商品图片
                orderNum            // 订单数量
                productSpec         // 颜色规格
            },
            {...},
            {...},
        ],
    }
 */


import { getUrlParams } from '../../utils'

export function listShow(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
      list.push({
        autoNo: i,
        skuNo: `${i}`,
        productNo: `132-${i}`,
        productName: `东店铺-${i}`,
        referWeight: Math.random() * 10 > 5 ? 3 : 4,
        productImage: '',
        orderNum: Math.ceil(Math.random() * 10),
        productSpec: '红色:160L',
      })
    }
    // if (searchParam && searchParam.enableStatus) {
    //   list = list.filter(ele => ele.enableStatus.indexOf(searchParam.enableStatus) > -1)
    // }
    return { list, total: count }
  }

  export function getSplitList(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 2
    // const result = itemList(count)
    const result = listShow(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
  }

  export default {
    getSplitList,
}
