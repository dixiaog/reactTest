/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-24 17:14:28
 {
    current: 1,
    pageSize: 20,
    shopNo: 1234,
	shopSkuNo; // 平台商品编号
	lockName; // 锁定名称
	isUnlock; // 锁定状态
}
 * @return （此处data中返回）
{
    "data": {
        "list": [
            {
              billNo // 单据编号(自增编号)
	          lockName // 锁定名称
	          lockMode; // 锁定模式(0: 百分比; 1: 指定缩量)
	          lockType; // 锁定类型(0: 店铺; 1: 链接锁定)
              shopNo; // 店铺编号
	          shopName; // 店铺名称
	          expireUnlock; // 过期解锁(0: 不解锁; 1: 解锁)
	          expireTime; // 过期时间
	          isUnlock; // 是否解锁(0: 不解锁; 1: 解锁)
	          unlockTime; // 解锁时间
              unlockUser; // 解锁人员
              createTime; // 创建时间
              createUser; // 创建人
            }
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
            billNo: `${i}`,
            lockName: `lockName-${i}`,
            lockMode: Math.random() * 10 > 5 ? 0 : 1,
            lockType: Math.random() * 10 > 5 ? 0 : 1,
            shopNo: 23,
            shopName: '波司登',
            expireUnlock: Math.random() * 10 > 5 ? 0 : 1,
            expireTime: '2018-01-19 17:22:43',
            isUnlock: Math.random() * 10 > 5 ? 0 : 1,
            unlockTime: '2018-01-19 17:22:43',
            unlockUser: `用户-${i}`,
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

export function getLockInventory(req, res, u, b) {
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
   getLockInventory,
}
