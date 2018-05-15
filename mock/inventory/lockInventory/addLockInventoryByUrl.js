/*
 * @Author: chenjie
 * @Date: 2018-01-23 10:07:35
 * @Last Modified by: chenjie
 * @Last Modified time: 2018-01-26 17:02:21
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
            shopSkuNo // 平台商品编码
            lockNum // 锁定数
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
                lockNum // 锁定数
                shopSkuNo // 平台sku编码
                usedLockNum // 已用锁定数
                deliveredNum // 已发货数
                isUnlock // 是否解锁
            },
            {...},
            {...},
        ]
    }
}

 */