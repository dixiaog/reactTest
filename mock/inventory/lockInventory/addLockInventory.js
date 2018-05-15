/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-27 15:00:28
 * 新建锁定库存
 {
    wmLockInventoryDto:{
        lockName：'', // 锁定名称
        shopNo: '', // 店铺编号
        shopName; // 店铺名称
        forbidSync //禁止同步(0: 不禁止; 1: 禁止)
        lockMode; // 锁定模式(0: 百分比; 1: 指定缩量)
        expireUnlock; // 过期解锁(0: 不解锁; 1: 解锁)
        expireTime; // 过期时间
    }
    LockInventoryList: [
        {
            skuNo //商品SKU编码
            productName // 商品名称
            lockNum // 锁定数
            -------- 以下参数无用，但为减少前端循环消耗，一起传递，后端只需保证DTO有这些字段即可 -----------
            invAvailableNum,    // 可用数
            nowLock,            // 本次锁定数
            percent             // 百分比
            specifiedNum,       // 指定数量
        },
        {...},
        {...},
    ]
 }
 * @return （此处data中返回）
{
    "data": {
       wmLockInventoryDto: {
            lockName：'', // 锁定名称
            shopNo: '', // 店铺编号
            shopName; // 店铺名称
            forbidSync //禁止同步(0: 不禁止; 1: 禁止)
            lockMode; // 锁定模式(0: 百分比; 1: 指定缩量)
            expireUnlock; // 过期解锁(0: 不解锁; 1: 解锁)
            expireTime; // 过期时间
       }
       LockInventoryList: [
            {
                skuNo //商品SKU编码
                productName // 商品名称
                lockNum // 原始锁定数
                shopSkuNo // 平台sku编码
                usedLockNum // 订单使用
                deliveredNum // 已发货数
                isUnlock // 是否解锁
                uploadStatus    // 上传状态
                remark         // 备注
            },
            {...},
            {...},
        ]
    }
}

 */
export function addLockInventory(req, res, u, b) {
    let url = u
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
      url = req.url // eslint-disable-line
    }
    return res.json(JSON.parse('{"success":true,"resultCode":"0000","errorMessage":"操作成功！","data":{"wmLockInventoryDto":{"lockMode":0,"lockName":"123","shopNo":"8","forbidSync":0,"expireUnlock":1,"expireTime":"2018-01-23T09:15:22.868Z","shopName":"的房间大概会抵扣几个好看的富贵花开觉得风火孤苦伶仃泛海国际还会发"},"LockInventoryList":[{"skuNo":123,"productName":"mockTestS数据","shopSkuNo":"xx2","usedLockNum":10,"deliveredNum":2,"isUnlock":0, "uploadStatus": 0, "remark":"上传失败的时候有报错信息"},{"skuNo":567,"productName":"mockTestS数据","shopSkuNo":"xx6","usedLockNum":10,"deliveredNum":2,"isUnlock":0, "uploadStatus": 1}]}}'))
}

export default {
    addLockInventory,
}
