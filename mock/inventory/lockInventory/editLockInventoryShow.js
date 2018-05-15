/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-30 09:02:42
 * 根据店铺获取锁定数列表
 {
    shopNo                          // 店铺No
    productName
    skuNo
 }
 * @return （此处data中返回）
{
    "data": {
       list: [     // LockInventoryList
            {
                skuNo //商品SKU编码
                productName // 商品名称
                shopSkuNo // 平台sku编码
                lockNum // 锁定数
                canUse  // 公有可用库存  = 主仓实际库存-(库存锁定数-库存锁定占用) -订单占有+虚拟库存
                usedLockNum // 已用锁定数
                deliveredNum // 已发货数
                isUnlock // 是否解锁
                editNum  //本次修改数， 传过来默认为 0
                remark
            },
            {...},
            {...},
        ]
    }
}

 */

import { getUrlParams } from '../../utils'

export function skuList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
            skuNo: `skuNo-${i}`,
            productName: `lockName-${i}`,
            lockNum: i + Math.ceil(Math.random() * 10),
            canUse: i + Math.ceil(Math.random() * 3),
            shopSkuNo: `shopSkuNo-${i}`,
            usedLockNum: i,
            deliveredNum: 0,
            isUnlock: Math.random() * 10 > 5 ? 0 : 1,
            editNum: 0,
            remark: `2222-${i}`,
        })
    }
    // if (searchParam) {
    //     if (searchParam.iId) { // 款式码
    //     list = list.filter(ele => ele.iId.indexOf(searchParam.iId) > -1)
    //     }
    //     if (searchParam.itemName) { // 商品名
    //     list = list.filter(ele => ele.itemName.indexOf(searchParam.itemName) > -1)
    //     }
    //     if (searchParam.itemAbb) { // 商品简称
    //     list = list.filter(ele => ele.itemAbb.indexOf(searchParam.itemAbb) > -1)
    //     }
    //     if (searchParam.color) { // 颜色及规格
    //     list = list.filter(ele => ele.color.indexOf(searchParam.color) > -1)
    //     }
    //     if (searchParam.enable) { // 启用
    //     list = list.filter(ele => ele.enable === searchParam.enable)
    //     }
    // }
    return { list, total: list.length }
}

export function editLockInventoryShow(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    const body = (b && b.body) || req.body
    const { searchParam } = body
    const params = getUrlParams(url)
    const count = (params.count * 1) || 20
    const result = skuList(count, searchParam)
    if (res && res.json) {
      res.json(result)
    } else {
      return result
    }
}

export default {
    editLockInventoryShow,
}

