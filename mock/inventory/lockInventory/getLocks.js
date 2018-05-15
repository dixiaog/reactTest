/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-03-16 13:13:39
 {
    current: 1,
    pageSize: 20,
    shopNo: 1234,
    siteNo;     // 平台
	shopSkuNo; // 平台商品编号
	lockName; // 锁定名称
	isUnlock; // 锁定状态
}
 * @return （此处data中返回）
{
    "data": {
        "list": [               // 注：文档中有 原始上传数据 , 数据库中没有，不需要！！
            {
                autoNo
                skuNo //商品SKU编码
                productName // 商品名称
                shopSkuNo // 平台sku编码
                lockNum // 锁定数
                usedLockNum // 已用锁定数
                deliveredNum // 已发货数
                isUnlock // 是否解锁
                uploadStatus   // 上传状态
                unlockTime     // 解锁时间
                createTime     // 创建时间
                remark         // 备注
                canUse          // 可用数
            },
            {...},
            {...},
            {...},
        ],
        "pagination": {
            "total": 1,
        }
    }
}

 */
import { getUrlParams } from '../../utils'

export function skuList(count, searchParam) {
    let list = []
    for (let i = 0; i < count; i += 1) {
        list.push({
            autoNo: i,
            skuNo: `skuNo-${i}`,
            productName: `productName-${i}`,
            shopSkuNo: `shopSkuNo-${i}`,
            lockNum: Math.ceil(Math.random() * 10),
            usedLockNum: Math.ceil(Math.random() * 10),
            deliveredNum: Math.ceil(Math.random() * 10),
            isUnlock: Math.random() * 10 > 5 ? 0 : 1,
            uploadStatus: Math.random() * 10 > 5 ? 0 : 1,
            unlockTime: '2018-01-19 17:22:43',
            createTime: '2018-01-29 17:22:43',
            remark: '',
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

export function getLocks(req, res, u, b) {
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
    getLocks,
}
